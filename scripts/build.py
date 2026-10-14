#!/usr/bin/env python3
"""Build one portable animation from metadata and a figure module. No dependencies."""
import argparse
import html
import json
import math
from pathlib import Path


def build(metadata, figure_code, output):
    assets = Path(__file__).resolve().parent.parent / 'assets'
    figure = json.loads(Path(metadata).read_text())
    for key in ('id', 'name', 'description'):
        if not isinstance(figure.get(key), str) or not figure[key].strip():
            raise ValueError(f'Metadata needs a nonempty {key}')
    duration = figure.get('duration', 8)
    if not isinstance(duration, (float, int)) or not math.isfinite(duration) or duration <= 0:
        raise ValueError('duration must be a finite, positive number')
    if figure.get('finish', 'drawing') not in ('drawing', 'flat', 'light', 'dark'):
        raise ValueError('Unknown finish')
    pose = figure.get('pose', duration * .54)
    if not isinstance(pose, (float, int)) or not math.isfinite(pose) or not 0 <= pose <= duration:
        raise ValueError('pose must be within the cycle')
    model = Path(figure_code).read_text()
    if 'function createFigure(' not in model:
        raise ValueError('Figure module must define function createFigure(scene,actors)')
    script = (assets / 'player.js').read_text()
    for marker, content in {
        '/*HELPERS*/': (assets / 'helpers.js').read_text(),
        '/*TOOLBAR_UI*/': (assets / 'toolbar.js').read_text(),
        '/*VECTOR_CONTOUR*/': (assets / 'vector-contour.js').read_text(),
        '/*FIGURE_CODE*/': model,
    }.items():
        script = script.replace(marker, content)
    script = "'use strict';\nconst FIGURE=" + json.dumps(figure) + ';\n' + script
    # Keep metadata or strings in a figure from closing the inline script element.
    script = script.replace('</', '<\\/')
    document = (assets / 'player.html').read_text()
    document = document.replace('__NAME__', html.escape(figure['name']))
    document = document.replace('__DESCRIPTION__', html.escape(figure['description'], quote=True))
    document = document.replace('__SCRIPT__', script)
    output = Path(output)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(document)
    print(f'{output}: {output.stat().st_size:,} bytes')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('metadata', type=Path)
    parser.add_argument('figure_code', type=Path)
    parser.add_argument('output', type=Path)
    args = parser.parse_args()
    build(args.metadata, args.figure_code, args.output)
