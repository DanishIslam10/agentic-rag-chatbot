import React from "react";

export default function FormattedMessage({ message }) {
	if (message === null || message === undefined) return null;

	// Parse inline formatting: **bold**, *italic*
	const parseInline = (text, keyPrefix = "") => {
		// Split on one-or-more slashes to render them as line breaks
		const slashParts = text.split(/\/+?/);

		return slashParts.map((part, i) => {
			const nodes = [];
			let lastIndex = 0;
			const regex = /(\*\*([\s\S]+?)\*\*|\*([\s\S]+?)\*)/g;
			let match;

			while ((match = regex.exec(part)) !== null) {
				if (match.index > lastIndex) {
					nodes.push(part.slice(lastIndex, match.index));
				}

				if (match[2] !== undefined) {
					nodes.push(
						<strong key={`${keyPrefix}-${i}-${nodes.length}`}>{match[2]}</strong>
					);
				} else if (match[3] !== undefined) {
					nodes.push(
						<em key={`${keyPrefix}-${i}-${nodes.length}`}>{match[3]}</em>
					);
				}

				lastIndex = match.index + match[0].length;
			}

			if (lastIndex < part.length) {
				nodes.push(part.slice(lastIndex));
			}

			// Wrap plain strings in <span> so React keys are consistent
			const mapped = nodes.map((n, idx) =>
				typeof n === "string" ? (
					<span key={`${keyPrefix}-${i}-s-${idx}`}>{n}</span>
				) : (
					n
				)
			);

			return (
				<React.Fragment key={`${keyPrefix}-frag-${i}`}>
					{mapped}
					{i < slashParts.length - 1 ? <br /> : null}
				</React.Fragment>
			);
		});
	};

	// Split incoming message by newlines and render structural elements
	const lines = String(message).split("\n");

	return (
		<div className="formatted-message">
			{lines.map((raw, idx) => {
				const line = raw.trimEnd();

				if (line.startsWith("### ")) {
					return (
						<h3 key={idx} className="text-lg font-semibold my-1">
							{parseInline(line.slice(4), `h-${idx}`)}
						</h3>
					);
				}

				// Use paragraph for normal lines
				return (
					<p key={idx} className="my-1">
						{parseInline(line, `p-${idx}`)}
					</p>
				);
			})}
		</div>
	);
}