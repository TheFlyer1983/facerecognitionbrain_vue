describe('useAvatars composable', () => {
  describe('initial state', () => {
    it('avatar starts as an empty string', () => {
      const { avatar } = useAvatars();
      expect(avatar.value).toBe('');
    });
  });

  describe('createAvatar', () => {
    it('sets avatar to the first character of the provided name', async () => {
      const { avatar, createAvatar } = useAvatars();
      await createAvatar('Alice');
      expect(avatar.value).toBe('A');
    });

    it('sets avatar to a lowercase initial when name starts with lowercase', async () => {
      const { avatar, createAvatar } = useAvatars();
      await createAvatar('bob');
      expect(avatar.value).toBe('b');
    });

    it('sets avatar to uppercase initial when name starts with uppercase', async () => {
      const { avatar, createAvatar } = useAvatars();
      await createAvatar('Charlie');
      expect(avatar.value).toBe('C');
    });

    it('sets avatar to the first character of a single-character name', async () => {
      const { avatar, createAvatar } = useAvatars();
      await createAvatar('X');
      expect(avatar.value).toBe('X');
    });

    it('sets avatar to empty string when given an empty name', async () => {
      const { avatar, createAvatar } = useAvatars();
      await createAvatar('');
      expect(avatar.value).toBe('');
    });

    it('updates avatar on subsequent calls', async () => {
      const { avatar, createAvatar } = useAvatars();
      await createAvatar('Alice');
      expect(avatar.value).toBe('A');
      await createAvatar('Bob');
      expect(avatar.value).toBe('B');
    });

    it('uses the first character of a name that starts with a number', async () => {
      const { avatar, createAvatar } = useAvatars();
      await createAvatar('1stPlace');
      expect(avatar.value).toBe('1');
    });

    it('each composable instance maintains its own avatar state', async () => {
      const instance1 = useAvatars();
      const instance2 = useAvatars();

      await instance1.createAvatar('Alice');
      await instance2.createAvatar('Bob');

      expect(instance1.avatar.value).toBe('A');
      expect(instance2.avatar.value).toBe('B');
    });
  });
});