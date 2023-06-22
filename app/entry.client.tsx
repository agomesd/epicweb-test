import { RemixBrowser, useLocation, useMatches } from '@remix-run/react'
import { useEffect, startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'
import * as Sentry from '@sentry/remix'

Sentry.init({
	dsn: 'https://979cc8d24dbd492ab557c06056f5842e:1530153a08574cf997eacf39f60ef801@o4505403412381696.ingest.sentry.io/4505403412447232',
	integrations: [
		new Sentry.BrowserTracing({
			// Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
			tracePropagationTargets: ['localhost', /^https:\/\/yourserver\.io\/api/],
			routingInstrumentation: Sentry.remixRouterInstrumentation(
				useEffect,
				useLocation,
				useMatches,
			),
		}),
		new Sentry.Replay(),
	],
	// Performance Monitoring
	tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
	// Session Replay
	replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
	replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
})

if (ENV.MODE === 'development') {
	import('~/utils/devtools.tsx').then(({ init }) => init())
}
if (ENV.MODE === 'production' && ENV.SENTRY_DSN) {
	import('~/utils/monitoring.client.tsx').then(({ init }) => init())
}

startTransition(() => {
	hydrateRoot(document, <RemixBrowser />)
})
