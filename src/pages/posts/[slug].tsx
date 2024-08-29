import Head from 'next/head'
import Image from 'next/image'
import type { Post } from '@/pages'
import { format, parseISO } from 'date-fns'
import Tweet from 'react-tweet-embed'
import { HOME, IMAGE_PATH } from '../../constants'
import { getAllPosts, getPostBySlug } from '../api/getPosts'
import { MDXRemote } from 'next-mdx-remote'
import type { MDXRemoteSerializeResult } from 'next-mdx-remote'
import type { GetStaticProps } from 'next'
import { serialize } from 'next-mdx-remote/serialize'
import Layout from '@/components/Layout/Layout'

export async function getStaticPaths() {
	const posts = getAllPosts()
	return {
		paths: posts.map((post) => ({
			params: { slug: post.slug },
		})),
		fallback: false,
	}
}

type PostPageProps = {
	source: MDXRemoteSerializeResult
	post: Post
}

const components = {
	h2: (props) => (
		<h2 {...props} className="text-black font-serif">
			{props.children}
		</h2>
	),
	h3: (props) => (
		<h3 {...props} className="text-black font-serif">
			{props.children}
		</h3>
	),
	p: (props) => (
		<p {...props} className="text-black opacity-80 font-serif">
			{props.children}
		</p>
	),
	ul: (props) => (
		<ul {...props} className="text-black opacity-80 font-serif">
			{props.children}
		</ul>
	),
	a: (props) => (
		<a {...props} className="text-black font-serif">
			{props.children}
		</a>
	),
	li: (props) => (
		<li {...props} className="text-black font-serif">
			{props.children}
		</li>
	),
	strong: (props) => (
		<strong {...props} className="text-black font-serif">
			{props.children}
		</strong>
	),
	Tweet,
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
	const post = getPostBySlug(params?.slug as string)

	const mdxSource = await serialize(post.content, {
		// Optionally pass remark/rehype plugins
		mdxOptions: {},
		scope: {
			...post,
			date: (post.date as unknown as Date).toISOString(),
		},
	})

	return {
		props: {
			source: mdxSource,
			post: {
				...post,
				date: (post.date as unknown as Date).toISOString(),
			},
		},
	}
}

const PostPage = ({ source, post }: PostPageProps) => {
	return (
		<Layout>
			<Head>
				<title>Diva Donate - {post.title}</title>
				<meta name="description" content={post.description} />
				<meta name="twitter:description" content={post.description} />
				<meta name="twitter:card" content="summary_large_image" />
				<meta
					name="twitter:image:src"
					content={`${HOME}${IMAGE_PATH}${post.coverImage}`}
				/>
				<meta name="twitter:image:alt" content={post.coverImageDescription} />
				<meta
					property="og:image"
					content={`${HOME}${IMAGE_PATH}${post.coverImage}`}
				/>
				<meta property="og:description" content={post.description} />
				<meta property="og:title" content={post.title} />
				<link rel="icon" href="/logo.svg" />
				<meta
					name="twitter:title"
					content="DIVA Donate - Parametric conditional donations"
				/>
			</Head>
			<article className="pb-12 relative mt-40 flex flex-col text-left items-center">
				<Image
					src={`${IMAGE_PATH}${post.coverImage}`}
					alt={post.coverImageDescription}
					width={post.coverImageWidth}
					height={post.coverImageHeight}
					className="rounded-2xl"
				/>
				<div className="pt-12 prose w-[100%] md:max-w-2xl m-auto text-black md:px-10">
					<h1 className="text-black">{post.title}</h1>
					<p className="text-slate text-black opacity-50">
						By{' '}
						<strong className="text-[#000000] opacity-100">
							{post.author}
						</strong>{' '}
						at <time>{format(parseISO(post.date), 'MMMM dd, yyyy')}</time>
					</p>
					<MDXRemote {...source} components={components} />
				</div>
			</article>
		</Layout>
	)
}

export default PostPage
