import { useEffect } from 'react';
import { backButton, useSignal } from '@telegram-apps/sdk-react';
import { useRouter } from "next/navigation"

/**
 * Component which controls the Back Button visibility.
 */
export function BackButton({ path = "/play" }: { path: string }) {
    const isVisible = useSignal(backButton.isVisible);
    const router = useRouter()

    useEffect(() => {
        console.log('The button is', isVisible ? 'visible' : 'invisible');
    }, [isVisible]);

    useEffect(() => {
        backButton.show();
        return () => {
            backButton.hide();
        };
    }, []);

    useEffect(() => {
        const back = () => router.replace(path)

        backButton.onClick(back)

        return () => backButton.offClick(back)
    }, [])

    return null;
}