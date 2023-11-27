import interact from 'interactjs';
import { reportMaker } from '../../stores/report-maker.store';
import type { UpsertProperties } from '$lib/reportSchema';

export const canvasInteract = () =>
	interact('#reportCanvas').resizable({
		edges: { top: false, left: false, bottom: true, right: false },
		listeners: {
			move: ({ deltaRect: { bottom } }) =>
				reportMaker.update(({ upsertReport, ...rest }) => ({
					...rest,
					upsertReport: { ...upsertReport, canvasHeight: upsertReport.canvasHeight + bottom }
				}))
		},
		modifiers: [interact.modifiers.restrictSize({ min: { width: 100, height: 200 } })],
		autoScroll: true
	});

export const componentInteract = (
	id: string,
	getProperties: () => UpsertProperties,
	callback: (properties: UpsertProperties) => void
) =>
	interact(`#${id}`)
		.resizable({
			edges: { top: true, left: true, bottom: true, right: true },
			listeners: {
				move: ({ deltaRect: { left, top }, rect: { width, height } }) => {
					const properties = getProperties();
					if (properties)
						callback({
							...properties,
							x: properties.x + left,
							y: properties.y + top,
							width,
							height
						});
				}
			},
			modifiers: [
				interact.modifiers.restrictEdges({
					outer: 'parent'
				}),
				interact.modifiers.restrictSize({
					min: { width: 50, height: 50 }
				})
			]
		})
		.draggable({
			listeners: {
				move: ({ dx, dy }) => {
					const properties = getProperties();
					if (properties)
						callback({
							...properties,
							x: properties.x + dx,
							y: properties.y + dy
						});
				}
			},
			modifiers: [
				interact.modifiers.restrictRect({
					restriction: 'parent',
					endOnly: true
				})
			]
		});
