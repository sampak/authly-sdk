import * as openpgp from 'openpgp';

export const encryptMessage = async (message: string, key: string): Promise<String | null> => {
    try {

        const encrypted = await openpgp.encrypt({
            message: await openpgp.createMessage({text: message}),
            encryptionKeys: await openpgp.readKey({armoredKey: key})
        })
        
        return encrypted;
    } catch(e) {
        console.log("Cannot encrypt message");
        return null;
    }
}