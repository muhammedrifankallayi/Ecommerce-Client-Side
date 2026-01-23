
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface LandingPageSection {
    id: string;
    title: string;
    subtitle?: string;
    description: string;
    image: string;
    buttonText?: string;
    buttonLink?: string;
    layout: 'image-left' | 'image-right' | 'image-top' | 'title-first';
    isActive: boolean;
}

const LandingSections = ({ sections }: { sections: LandingPageSection[] }) => {
    if (!sections || sections.length === 0) return null;

    const activeSections = sections.filter(section => section.isActive !== false);

    return (
        <div className="flex flex-col gap-24 py-24 bg-white">
            {activeSections.map((section, index) => {
                const isImageLeft = section.layout === 'image-left';
                const isImageRight = section.layout === 'image-right';
                const isImageTop = section.layout === 'image-top';
                const isTitleFirst = section.layout === 'title-first';

                if (isImageLeft || isImageRight) {
                    return (
                        <div key={section.id || index} className="container mx-auto px-4 md:px-6">
                            <div className={cn(
                                "grid grid-cols-1 md:grid-cols-2 gap-12 items-center",
                                isImageRight && "md:flex-row-reverse"
                            )}>
                                <div className={cn("relative aspect-square md:aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl group", isImageRight && "md:order-2")}>
                                    <img
                                        src={section.image}
                                        alt={section.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />
                                </div>

                                <div className={cn("flex flex-col space-y-6", isImageRight && "md:order-1")}>
                                    {section.subtitle && (
                                        <Badge variant="secondary" className="w-fit text-sm px-4 py-1 rounded-full bg-primary/10 text-primary border-none font-semibold">
                                            {section.subtitle}
                                        </Badge>
                                    )}
                                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-gray-900 leading-[1.1]">
                                        {section.title}
                                    </h2>
                                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl">
                                        {section.description}
                                    </p>
                                    {section.buttonText && (
                                        <Button
                                            onClick={() => window.location.href = section.buttonLink || '#'}
                                            className="w-fit group h-14 px-8 rounded-full text-lg shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all"
                                        >
                                            {section.buttonText}
                                            <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                }

                if (isImageTop) {
                    return (
                        <div key={section.id || index} className="container mx-auto px-4 md:px-6">
                            <div className="flex flex-col items-center text-center space-y-12">
                                <div className="w-full max-w-5xl aspect-[21/9] rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
                                    <img
                                        src={section.image}
                                        alt={section.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60" />
                                </div>

                                <div className="max-w-3xl flex flex-col items-center space-y-6">
                                    {section.subtitle && (
                                        <span className="text-primary font-bold tracking-[0.3em] uppercase text-sm mb-2">
                                            {section.subtitle}
                                        </span>
                                    )}
                                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-gray-900 leading-none">
                                        {section.title}
                                    </h2>
                                    <p className="text-xl text-gray-600 leading-relaxed font-medium">
                                        {section.description}
                                    </p>
                                    {section.buttonText && (
                                        <Button
                                            size="lg"
                                            onClick={() => window.location.href = section.buttonLink || '#'}
                                            className="rounded-full px-12 h-14 text-lg font-bold"
                                        >
                                            {section.buttonText}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                }

                if (isTitleFirst) {
                    return (
                        <div key={section.id || index} className="w-full bg-secondary/5 py-32">
                            <div className="container mx-auto px-4 md:px-6">
                                <div className="flex flex-col items-center space-y-16">
                                    <div className="text-center space-y-6 max-w-4xl mx-auto">
                                        {section.subtitle && (
                                            <p className="text-primary font-black tracking-widest uppercase text-sm animate-fade-in">
                                                {section.subtitle}
                                            </p>
                                        )}
                                        <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-gray-900 leading-none">
                                            {section.title}
                                        </h2>
                                    </div>

                                    <div className="w-full max-w-6xl aspect-video rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] border-8 border-white">
                                        <img
                                            src={section.image}
                                            alt={section.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    <div className="max-w-3xl mx-auto text-center space-y-10">
                                        <p className="text-2xl md:text-3xl leading-relaxed text-gray-700 font-medium italic">
                                            "{section.description}"
                                        </p>
                                        {section.buttonText && (
                                            <Button
                                                size="lg"
                                                variant="default"
                                                onClick={() => window.location.href = section.buttonLink || '#'}
                                                className="rounded-full px-16 h-16 text-xl font-black shadow-2xl hover:scale-105 transition-transform"
                                            >
                                                {section.buttonText}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                }

                return null;
            })}
        </div>
    );
};

export default LandingSections;
