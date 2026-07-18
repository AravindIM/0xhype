const VIDEO_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
  "vimeo.com",
  "player.vimeo.com",
]);

export function isVideoHost(hostname: string | null): boolean {
  return hostname !== null && VIDEO_HOSTS.has(hostname);
}
