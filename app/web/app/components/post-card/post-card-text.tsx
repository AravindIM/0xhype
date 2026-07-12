interface PostCardTextProps {
  link: string;
  postTitle: string;
  previewTitle: string;
  previewDescription: string;
}

export function PostCardText({
  link,
  postTitle,
  previewTitle,
  previewDescription,
}: PostCardTextProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="pointer-events-auto block cursor-pointer"
    >
      <h2 className="overflow-hidden max-h-[2lh] text-2xl font-bold leading-tight text-white">
        {postTitle}
      </h2>
      <div className="pt-1.5 line-clamp-3">
        <h3 className="text-sm leading-5 font-bold text-white">
          {previewTitle}
        </h3>
        <p className="mt-1.5 text-sm leading-5 font-medium text-white/70">
          {previewDescription}
        </p>
      </div>
    </a>
  );
}
