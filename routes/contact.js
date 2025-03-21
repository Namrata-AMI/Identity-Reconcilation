const express = require("express");
const Contact = require("../models/contact.js");
const router = express.Router();

// get route //
router.get("/identify",async(req,res)=>{
    try{
        const contacts = await Contact.find({});
        return res.status(200).json({
            message:"Contacts recieved ",
            data:contacts,
        })
    }
    catch(e){
        console.log(e);
        return res.status(500).json({message:" No Contacts , Internal Server Error ...!!"});
    }
})


// post route //
router.post("/identify",async(req,res)=>{
    try{
        const {email, phoneNo} = req.body;

        if(!phoneNo && !email){
            return res.status(400).json({message:"Phone no or emial id required!!!"});
        }


        let existContact = await Contact.find({$or: [{email},{phoneNo}]});  

    
        if(existContact.length === 0){

            // new contact createe
            const newContact = await Contact.create({email,phoneNo, linkPrecedence:"primary"});

            return res.status(200).json({
                primaryContactId:newContact._id,
                emails : [email],
                phoneNos:[phoneNo],
                secondaryContactIds:[],

            })
        }


        // find if exists primary contact
        let primaryContact = existContact.find(contact => contact.linkPrecedence === "primary");
        if (!primaryContact) primaryContact = existContact[0];

        // new emial/phone , creating secondry//
        let secondaryContact = !existContact.find(e=> e.email === email && e.phoneNo === phoneNo); // if not exists -> false then (!false = true)//

        if(secondaryContact){
            let secondaryNewContact = await Contact.create({  // creating secondary contacts //
                email,
                phoneNo,
                linkId:primaryContact._id,
                linkPrecedence:"secondary",
            });
            existContact.push(secondaryNewContact);  // pushing to [] => to track the secondary contacts//
        }

        return res.status(200).json({
            primaryContactId:primaryContact._id,
            emails:[...new Set(existContact.map(e => e.email))],
            phoneNos:[...new Set(existContact.map(e => e.phoneNo))],
            secondaryContactIds:existContact.filter(e => e.linkPrecedence === "secondary").map(e => e._id),
        });


    }
    catch(err){
        console.log(err);
        return res.status(500).json({message : "Internal server Error"});
    }
})


module.exports = router;