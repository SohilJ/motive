#!/usr/bin/env python3
"""Check a Motive batch's deliverable contract. Visual/motion review is separate."""
import argparse
import json
import re
from pathlib import Path


def check_file(path):
    text = Path(path).read_text()
    errors = []
    match = re.search(r'const FIGURE=(\{[^\n]*\});', text)
    try:
        meta = json.loads(match.group(1)) if match else {}
    except (ValueError, AttributeError):
        meta = {}
    for key in ('id', 'name', 'description'):
        if not isinstance(meta.get(key), str) or not meta[key].strip():
            errors.append('Missing figure metadata: ' + key)
    if meta.get('finish', 'drawing') != 'drawing':
        errors.append('Default finish must be Construction')
    duration = meta.get('duration', 8)
    if not isinstance(duration, (int, float)) or not 0 < duration < float('inf'):
        errors.append('Invalid duration')
    if re.search(r'<script\b[^>]*\bsrc\s*=|<link\b[^>]*\brel=[\"\']stylesheet|<iframe\b', text, re.I):
        errors.append('Standalone output depends on another document or script')
    for control in ('play', 'intensity', 'speed', 'finish', 'restart', 'position', 'settings'):
        if not re.search(r'\bid=[\"\']' + control + r'[\"\']', text):
            errors.append('Missing shared control: ' + control)
    for marker in ('function createFigure(', 'function constructionFinish(', 'function vectorFinish(', 'non-scaling-stroke', 'prefers-reduced-motion'):
        if marker not in text:
            errors.append('Missing player/renderer requirement: ' + marker)
    return {'file': str(path), 'id': meta.get('id'), 'errors': errors}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('files', nargs='+', type=Path)
    parser.add_argument('--expected-count', required=True, type=int)
    parser.add_argument('--report', type=Path)
    args = parser.parse_args()
    results = [check_file(p) for p in args.files]
    failures = []
    if len(results) != args.expected_count:
        failures.append(f'Expected {args.expected_count} files, got {len(results)}')
    ids = [r['id'] for r in results]
    if len(set(ids)) != len(ids):
        failures.append('Duplicate figure IDs')
    report = {'expected': args.expected_count, 'actual': len(results), 'batch_errors': failures, 'figures': results,
              'visual_review': 'Required separately: meaning, continuous motion, composition, contours, and key poses.'}
    if args.report:
        args.report.parent.mkdir(parents=True, exist_ok=True)
        args.report.write_text(json.dumps(report, indent=2) + '\n')
    for r in results:
        print(('FAIL' if r['errors'] else 'PASS') + ' ' + str(r['file']))
        for error in r['errors']:
            print('  ' + error)
    for failure in failures:
        print('FAIL ' + failure)
    print('Static contract checked. Visual and motion review is still required.')
    return 1 if failures or any(r['errors'] for r in results) else 0


if __name__ == '__main__':
    raise SystemExit(main())
