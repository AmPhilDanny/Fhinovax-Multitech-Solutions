import { db } from "@/db";
import { pages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
  
  if (page.length === 0) return { title: "Page Not Found" };
  
  return {
    title: `${page[0].title} | Phinovax`,
  };
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  
  const page = await db
    .select()
    .from(pages)
    .where(eq(pages.slug, slug))
    .limit(1);

  if (page.length === 0 || !page[0].isPublished) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Page Header */}
      <div className="bg-brand-blue py-20 text-white">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight italic">
            {page[0].title}
          </h1>
        </div>
      </div>

      {/* Page Content */}
      <article className="max-w-4xl mx-auto px-4 py-16 prose prose-blue lg:prose-xl">
        <div 
          className="dynamic-content text-gray-700 leading-relaxed space-y-6"
          dangerouslySetInnerHTML={{ __html: page[0].content }} 
        />
      </article>
    </div>
  );
}
