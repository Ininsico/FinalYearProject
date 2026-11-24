import { useMemo } from "react"

const INLINE_PATTERN = /(\*\*\*[^*\n]+\*\*\*|\*\*[^*\n]+\*\*|\*[^*\n]+\*|`[^`\n]+`)/g

function renderInline(text, keyPrefix) {
  if (!text) return null
  const parts = String(text).split(INLINE_PATTERN).filter((part) => part)
  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`
    if (part.startsWith("***") && part.endsWith("***")) {
      return (
        <strong key={key}>
          <em>{part.slice(3, -3)}</em>
        </strong>
      )
    }
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={key}>{part.slice(2, -2)}</strong>
    }
    if (part.length > 2 && part.startsWith("*") && part.endsWith("*")) {
      return <em key={key}>{part.slice(1, -1)}</em>
    }
    if (part.length > 2 && part.startsWith("`") && part.endsWith("`")) {
      return <code key={key}>{part.slice(1, -1)}</code>
    }
    return <span key={key}>{part}</span>
  })
}

const LIST_ITEM = /^(\s*)([-*•]|\d+[.)])\s+(.*)$/

function buildListTree(items) {
  const root = { children: [] }
  const stack = [root]
  for (const item of items) {
    while (stack.length > 1 && item.depth <= stack[stack.length - 1].depth) stack.pop()
    const node = { ...item, children: [] }
    stack[stack.length - 1].children.push(node)
    stack.push(node)
  }
  return root.children
}

function renderListNodes(nodes, keyPrefix) {
  if (!nodes.length) return null
  const Tag = nodes[0].ordered ? "ol" : "ul"
  return (
    <Tag>
      {nodes.map((node, index) => (
        <li key={`${keyPrefix}-${index}`}>
          {renderInline(node.text, `${keyPrefix}-${index}`)}
          {node.children.length > 0 && renderListNodes(node.children, `${keyPrefix}-${index}`)}
        </li>
      ))}
    </Tag>
  )
}

function isBlockStart(line) {
  return (
    !line ||
    /^```/.test(line) ||
    /^(#{1,6})\s+/.test(line) ||
    LIST_ITEM.test(line) ||
    /^([-*_])\1{2,}$/.test(line)
  )
}

function parseBlocks(source) {
  const lines = String(source ?? "").replace(/\r\n/g, "\n").split("\n")
  const blocks = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i].trim()

    if (!line) {
      i += 1
      continue
    }

    const fence = line.match(/^```(\w*)/)
    if (fence) {
      const code = []
      i += 1
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        code.push(lines[i])
        i += 1
      }
      i += 1
      blocks.push({ type: "code", lang: fence[1] ?? "", text: code.join("\n") })
      continue
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/)
    if (heading) {
      blocks.push({ type: "heading", level: heading[1].length, text: heading[2] })
      i += 1
      continue
    }

    if (/^([-*_])\1{2,}$/.test(line)) {
      blocks.push({ type: "hr" })
      i += 1
      continue
    }

    if (LIST_ITEM.test(lines[i])) {
      const items = []
      while (i < lines.length && LIST_ITEM.test(lines[i])) {
        const match = lines[i].match(LIST_ITEM)
        const indent = match[1].replace(/\t/g, "  ").length
        items.push({
          depth: Math.min(Math.floor(indent / 2), 3),
          ordered: /\d/.test(match[2]),
          text: match[3],
        })
        i += 1
      }
      blocks.push({ type: "list", items: buildListTree(items) })
      continue
    }

    const paragraph = []
    while (i < lines.length && !isBlockStart(lines[i].trim())) {
      paragraph.push(lines[i].trim())
      i += 1
    }
    if (paragraph.length === 0) {
      i += 1
      continue
    }
    blocks.push({ type: "p", text: paragraph.join(" ") })
  }

  return blocks
}

/**
 * Lightweight, dependency-free markdown renderer for AI-generated course text.
 * Handles headings, bold/italic, inline code, fenced code blocks, lists and
 * rules — everything the lesson generator emits.
 */
export default function Markdown({ text = "", className = "" }) {
  const blocks = useMemo(() => parseBlocks(text), [text])

  return (
    <div className={`md ${className}`}>
      {blocks.map((block, index) => {
        const key = `b-${index}`
        if (block.type === "code") {
          return (
            <pre key={key}>
              <code>{block.text}</code>
            </pre>
          )
        }
        if (block.type === "heading") {
          const Tag = block.level <= 2 ? "h4" : "h5"
          return <Tag key={key}>{renderInline(block.text, key)}</Tag>
        }
        if (block.type === "hr") return <hr key={key} />
        if (block.type === "list") return <div key={key}>{renderListNodes(block.items, key)}</div>
        return <p key={key}>{renderInline(block.text, key)}</p>
      })}
    </div>
  )
}
