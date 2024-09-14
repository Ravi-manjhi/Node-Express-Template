process.on('uncaughtException', (error: Error) => {
  console.error('uncaughtException: %o', {
    name: error.name,
    message: error.message.split('\n')[0],
    stack: JSON.stringify(error.stack, null, 2),
  });

  process.exit(1);
});
