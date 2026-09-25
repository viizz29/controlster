import { APP_NAME } from "@/config";
import { useEffect } from "react";

export function usePageTitle(title: string) {

    useEffect(() => {
        document.title = `${APP_NAME} ${title}`;
    }, []);


    return "ok";
}
