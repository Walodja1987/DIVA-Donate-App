import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
	static async getInitialProps(ctx) {
		const initialProps = await Document.getInitialProps(ctx)

		return initialProps
	}

	render() {
		return (
			<Html>
				<Head>
					<link
						href="https://fonts.googleapis.com/css2?family=Lora:wght@600&family=Open+Sans&display=swap"
						rel="stylesheet"
					/>
					<link rel="icon" href="/favicon.svg" />

					{/* Google tag (gtag.js) */}
					<script 
						async
						src="https://www.googletagmanager.com/gtag/js?id=G-1PSDJ6GTTQ">
					</script>
					<script>
						{`
							window.dataLayer = window.dataLayer || [];
							function gtag(){dataLayer.push(arguments);}
							gtag('js', new Date());

							gtag('config', 'G-1PSDJ6GTTQ');
						`}
					</script>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

export default MyDocument
