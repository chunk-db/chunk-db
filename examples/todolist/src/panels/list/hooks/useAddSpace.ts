import { useChunkDB } from '@chunk-db/react';
import { useCallback } from 'react';

interface ISpaceDraft {
    name: string;
    description?: string;
}

export function useAddSpace() {
    const db = useChunkDB();

    return useCallback(
        ({ name, description }: ISpaceDraft) => {
            name = name.trim();
            description = (description || '').trim();
            if (!name) return;

            const space = db.spaces.create({
                name,
                description,
            });

            db.spaces.save(space.id);
        },
        [db]
    );
}
