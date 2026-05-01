import { GitHubIcon, TwitterIcon, InstagramIcon, YouTubeIcon, TelegramIcon, DiscordIcon, TwitchIcon, LinkedInIcon, TikTokIcon, SpotifyIcon } from './Icons';

const icons = [
  { Icon: GitHubIcon, color: '#ffffff' },
  { Icon: TwitterIcon, color: '#1DA1F2' },
  { Icon: InstagramIcon, color: '#E1306C' },
  { Icon: YouTubeIcon, color: '#FF0000' },
  { Icon: TelegramIcon, color: '#229ED9' },
  { Icon: DiscordIcon, color: '#5865F2' },
  { Icon: TwitchIcon, color: '#9146FF' },
  { Icon: LinkedInIcon, color: '#0077B5' },
  { Icon: TikTokIcon, color: '#888' },
  { Icon: SpotifyIcon, color: '#1DB954' },
  { Icon: GitHubIcon, color: '#ffffff' },
  { Icon: TwitterIcon, color: '#1DA1F2' },
  { Icon: InstagramIcon, color: '#E1306C' },
  { Icon: YouTubeIcon, color: '#FF0000' },
  { Icon: TelegramIcon, color: '#229ED9' },
  { Icon: DiscordIcon, color: '#5865F2' },
];

export default function FloatingIcons() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* Row 1 */}
      <div className="absolute top-[8%] flex gap-16 animate-scroll-left opacity-10">
        {[...icons, ...icons].map((item, i) => (
          <div key={i} className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
            <item.Icon size={36} color={item.color} />
          </div>
        ))}
      </div>
      {/* Row 2 */}
      <div className="absolute top-[24%] flex gap-16 animate-scroll-right opacity-[0.07]" style={{ animationDelay: '-5s' }}>
        {[...icons, ...icons].map((item, i) => (
          <div key={i} className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
            <item.Icon size={30} color={item.color} />
          </div>
        ))}
      </div>
      {/* Row 3 */}
      <div className="absolute top-[42%] flex gap-16 animate-scroll-left opacity-[0.06]" style={{ animationDelay: '-12s' }}>
        {[...icons, ...icons].map((item, i) => (
          <div key={i} className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
            <item.Icon size={32} color={item.color} />
          </div>
        ))}
      </div>
      {/* Row 4 */}
      <div className="absolute top-[62%] flex gap-16 animate-scroll-right opacity-[0.08]" style={{ animationDelay: '-8s' }}>
        {[...icons, ...icons].map((item, i) => (
          <div key={i} className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
            <item.Icon size={28} color={item.color} />
          </div>
        ))}
      </div>
      {/* Row 5 */}
      <div className="absolute top-[80%] flex gap-16 animate-scroll-left opacity-[0.05]" style={{ animationDelay: '-3s' }}>
        {[...icons, ...icons].map((item, i) => (
          <div key={i} className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
            <item.Icon size={34} color={item.color} />
          </div>
        ))}
      </div>
    </div>
  );
}
