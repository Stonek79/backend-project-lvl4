export default (labels) => [labels].flat().map((label) => ({ id: Number(label) }));
