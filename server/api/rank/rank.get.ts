const emojis = ['😄', '😃', '😀', '😊', '😉', '😍', '🔸', '🔹', '🚀'];

export default defineEventHandler(async (event) => {
  const rank = Number(getQuery(event).rank);
  if (rank) {
    const rankEmoji = emojis[rank >= emojis.length ? emojis.length - 1 : rank];

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: {
        input: rankEmoji
      }
    };
  } else {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: {
        error: 'Invalid rank parameter'
      }
    };
  }
});
