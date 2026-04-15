import Image from 'next/image';

interface HeroProps {
  name: string;
  tagline: string;
  bio?: string;
  avatarUrl?: string;
}

export default function Hero({ name, tagline, bio, avatarUrl }: HeroProps) {
  return (
    <header className="text-center py-10 md:py-14">
      {avatarUrl && (
        <div className="w-28 h-28 md:w-36 md:h-36 mx-auto mb-6 rounded-full overflow-hidden border-4 border-ink-200 shadow-xl">
          <Image
            src={avatarUrl}
            alt={name}
            width={144}
            height={144}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ink-900 font-medium tracking-tight">
        {name}
      </h1>
      <p className="font-serif text-xl md:text-2xl text-ink-600 mt-3 italic">
        {tagline}
      </p>
      {bio && (
        <p className="max-w-xl mx-auto text-ink-600 text-sm md:text-base mt-5 leading-relaxed">
          {bio}
        </p>
      )}
    </header>
  );
}
