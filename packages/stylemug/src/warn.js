export default function warn(error) {
  let message = 'There are warnings in your stylesheet:\n\n';

  if (error.fileName) {
    message += error.fileName + '\n';
    message += '  ' + error.sourceLinesRange;
    message += '\n\n';
  }

  error.messages.forEach((msg, i) => {
    message += i + 1 + ') ' + msg + '\n';
  });

  console.warn('[stylemug]', message);
}
