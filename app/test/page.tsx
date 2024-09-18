"use client";

import { Crisp } from "crisp-sdk-web";
import { useEffect } from "react";

export default function Test(){

    const userLogin = () => {
 
        Crisp.configure(process.env.NEXT_PUBLIC_WEBSITE_ID || "", {
          autoload: false, 
        });

        Crisp.setTokenId("token");
     
        Crisp.load();
      
        Crisp.chat.open();
      }

      useEffect(() => {
        userLogin(); 
      }, [])
    
      const showCarousel = () => {
 
    const list = [
        {
        title: "Slide 1 du carousel",
        description: "Description du slide 1",
        actions: [
            {
            label: "Texte du bouton",
            url: "/mon-compte/voter",
            },
        ],
        },
        {
        title: "Slide 2 du carousel",
        description: "Description du slide 2",
        actions: [
            {
            label: "Texte du bouton",
            url: "/mon-compte/voter",
            },
        ],
        }
    ]
    
   
    Crisp.message.show("carousel", {
        text: "Voici la liste des oeuvres :",
        targets: list,
  });
      }

    return(
    <>
        <h1>Page test</h1>
        <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nihil neque aliquam necessitatibus ratione delectus voluptas eaque aperiam provident? Omnis quo a dolore ut minima incidunt explicabo vero non iure? Fugit.
        </p>
        <button onClick={showCarousel}>Afficher un carousel</button>
    </>
    )
}