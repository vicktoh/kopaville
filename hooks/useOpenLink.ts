import { useToast } from 'native-base'
import * as WebBrowser from 'expo-web-browser';


export const useOpenLink = () =>{
   const toast = useToast();


   const  openLink = async (link: string)=> {
      if(!link) return;
      try {
      await WebBrowser.openBrowserAsync(link);
      } catch (error) {
         toast.show({ title: 'Invalid Link', description: 'cannot open this link', status: 'error' });
      }
   }

   return { openLink };
}