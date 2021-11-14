import { Storage } from "@capacitor/storage"
import { ItemProps } from "../../components/payload/generic-item/ItemProps";


export class LocalStorage {
    storeAuth = async (token: string) => {
        await Storage.set({
            key: "auth",
            value: token,
        });
        console.log("[LOCAL STORAGE] - Stored Auth: " + token);
    };

    removeAuth = async () => {
        await Storage.remove({
            key: "auth",
        });
        console.log("[LOCAL STORAGE] - Removed Auth");
    };

    async getAuth(): Promise<string | null>  {
        const { value } = await Storage.get({ key: 'auth' });
        return value;
    }

    storeItem = async (item: ItemProps) => {
        await Storage.set({
            key: "item|" + item.id,
            value: JSON.stringify(item),
        });
        console.log("[LOCAL STORAGE] - Stored Item: " + item.id);
    };

}