export const useAvatars = () => {
  const avatar: Ref<string> = ref('');

  async function createAvatar(name: string) {
    const initials = name.charAt(0);

    avatar.value = initials;
  }

  return { avatar, createAvatar };
};
