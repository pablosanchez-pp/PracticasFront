'use server';

import { revalidatePath } from 'next/cache';

export const revalidatePage = (route: string) => {
  revalidatePath(route, 'page');
};
	