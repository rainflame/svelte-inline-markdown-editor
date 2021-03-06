import { locations } from "./stringModifiers";

export const getRange = () => {
	const selection = window.getSelection();
	return [selection.getRangeAt(0), selection];
};

export const getSelectionAndPosition = (root) => {
	const [range, selection] = getRange();
	range.setStart(root, 0);
	const position = range.toString().length;

	return [selection, position];
};

// fanstatic solution from
// https://stackoverflow.com/a/38479462
export const saveCaretPosition = (root, offset = 0) => {
	const [selection, position] = getSelectionAndPosition(root);

	return () => {
		// restore the position of the cursor
		const pos = getTextNodeAtPosition(root, position + offset);
		selection.removeAllRanges();
		const range = new Range();
		range.setStart(pos.node, pos.position);
		selection.addRange(range);
	};
};

export const getCaretPosition = (root) => {
	const [selection, position] = getSelectionAndPosition(root);
	return getTextNodeAtPosition(root, position);
};

export const getTextNodeAtPosition = (root, index) => {
	const treeWalker = document.createTreeWalker(
		root,
		NodeFilter.SHOW_TEXT,
		(elem) => {
			if (index > elem.textContent.length) {
				index -= elem.textContent.length;
				return NodeFilter.FILTER_REJECT;
			}
			return NodeFilter.FILTER_ACCEPT;
		}
	);
	const c = treeWalker.nextNode();
	return {
		node: c ? c : root,
		position: index,
	};
};
