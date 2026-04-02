import React, { useMemo, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { buildRenderItems, buildVisibleMap, computeDiffLines } from './diff';
import { defaultLocale } from './locale';
import { getBackgroundColor, getPrefix } from './style';
import type { DiffViewerProps } from './types';

export function DiffViewer({
  original,
  modified,
  contextLines = 2,
  height = 500,
  locale,
}: DiffViewerProps): React.JSX.Element {
  const [expandedBlocks, setExpandedBlocks] = useState<Record<number, boolean>>(
    {},
  );

  const mergedLocale = {
    ...defaultLocale,
    ...locale,
  };

  const diffLinesData = useMemo(() => {
    return computeDiffLines(original, modified);
  }, [original, modified]);

  const visibleMap = useMemo(() => {
    return buildVisibleMap(diffLinesData, contextLines);
  }, [diffLinesData, contextLines]);

  const renderItems = useMemo(() => {
    return buildRenderItems(diffLinesData, visibleMap, expandedBlocks);
  }, [diffLinesData, visibleMap, expandedBlocks]);

  function toggleBlock(blockStart: number): void {
    setExpandedBlocks((prev) => ({
      ...prev,
      [blockStart]: !prev[blockStart],
    }));
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        fontFamily:
          'ui-monospace, SFMono-Regular, SF Mono, Consolas, Liberation Mono, Menlo, monospace',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      <Virtuoso
        style={{ height }}
        totalCount={renderItems.length}
        itemContent={(index) => {
          const item = renderItems[index];

          if (item.type === 'line') {
            const { line } = item;

            return (
              <div
                style={{
                  display: 'flex',
                  borderBottom: '1px solid #f3f4f6',
                }}
              >
                <div
                  style={{
                    width: '50%',
                    display: 'flex',
                    padding: '4px 8px',
                    boxSizing: 'border-box',
                    backgroundColor: getBackgroundColor(
                      line.type,
                      line.leftLineNumber !== null,
                    ),
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      textAlign: 'right',
                      paddingRight: 12,
                      color: '#6b7280',
                      flexShrink: 0,
                    }}
                  >
                    {line.leftLineNumber ?? ''}
                  </div>
                  <div
                    style={{
                      width: 24,
                      textAlign: 'center',
                      paddingRight: 12,
                      color: '#6b7280',
                      flexShrink: 0,
                    }}
                  >
                    {getPrefix(line.type, line.leftLineNumber !== null)}
                  </div>
                  <pre
                    style={{
                      margin: 0,
                      flex: 1,
                      whiteSpace: 'pre-wrap',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {line.leftContent}
                  </pre>
                </div>

                <div
                  style={{
                    width: '50%',
                    display: 'flex',
                    padding: '4px 8px',
                    boxSizing: 'border-box',
                    backgroundColor: getBackgroundColor(
                      line.type,
                      line.rightLineNumber !== null,
                    ),
                  }}
                >
                  <div
                    style={{
                      width: 48,
                      textAlign: 'right',
                      paddingRight: 12,
                      color: '#6b7280',
                      flexShrink: 0,
                    }}
                  >
                    {line.rightLineNumber ?? ''}
                  </div>
                  <div
                    style={{
                      width: 24,
                      textAlign: 'center',
                      paddingRight: 12,
                      color: '#6b7280',
                      flexShrink: 0,
                    }}
                  >
                    {getPrefix(line.type, line.rightLineNumber !== null)}
                  </div>
                  <pre
                    style={{
                      margin: 0,
                      flex: 1,
                      whiteSpace: 'pre-wrap',
                      overflowWrap: 'anywhere',
                    }}
                  >
                    {line.rightContent}
                  </pre>
                </div>
              </div>
            );
          }

          return (
            <button
              type="button"
              onClick={() => toggleBlock(item.blockStart)}
              style={{
                width: '100%',
                border: 0,
                borderBottom: '1px solid #e5e7eb',
                backgroundColor: '#f9fafb',
                padding: '8px 12px',
                cursor: 'pointer',
                color: '#374151',
                fontStyle: 'italic',
              }}
            >
              {item.expanded
                ? mergedLocale.collapse
                : mergedLocale.showMoreLines(item.hiddenCount)}
            </button>
          );
        }}
      />
    </div>
  );
}