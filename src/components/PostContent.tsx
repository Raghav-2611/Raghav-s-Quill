'use client'

interface PostContentProps {
    content: string
    isPoem: boolean
}

export default function PostContent({ content, isPoem }: PostContentProps) {
    const lines = content.split('\n')

    return (
        <div className={isPoem ? 'post-body post-body--poem' : 'post-body post-body--story'}>
            {lines.map((line, i) => (
                <span key={i} className="post-line">
                    {line === '' ? '\u00A0' /* non-breaking space keeps blank lines */ : line}
                </span>
            ))}
        </div>
    )
}
