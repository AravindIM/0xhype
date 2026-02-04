import { PreviewImage } from "./preview-image";
import { PreviewInfo } from "./preview-info";

export interface PreviewProps {
  link: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  siteUrl?: string;
  favicon?: string;
  isLoading?: boolean;
}

export function Preview({
  link,
  title,
  description,
  image,
  siteName,
  siteUrl,
  favicon,
  isLoading = false,
}: PreviewProps) {
  return (
    <>
      <PreviewImage src={image} isLoading={isLoading} />
      <PreviewInfo
        link={link}
        title={title}
        description={description}
        siteName={siteName}
        siteUrl={siteUrl}
        favicon={favicon}
        isLoading={isLoading}
      />
    </>
  );
}
