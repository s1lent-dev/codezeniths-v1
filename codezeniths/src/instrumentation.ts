export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { initMq } = await import('@/lib/mq');
    try {
      await initMq();
      console.log('[Bootstrap] RabbitMQ topology and consumers initialized successfully.');
    } catch (error) {
      console.error('[Bootstrap] Failed to initialize RabbitMQ on startup:', error);
    }
  }
}
