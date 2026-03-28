const emojis = ['😄', '😃', '😀', '😊', '😉', '😍', '🔸', '🔹', '🚀'];

export default defineEventHandler(async (event) => {
  const rank = Number(getQuery(event).rank);

  if (Number.isInteger(rank) && rank >= 0) {
    const rankEmoji = emojis[rank >= emojis.length ? emojis.length - 1 : rank];

    return {
      input: rankEmoji
    };
  } else {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Invalid rank parameter! Rank should be a non-negative integer.'
    });
  }
});
