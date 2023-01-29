import { 
    indexCharacter, 
    createCharacter,
    showCharacter,
    updateCharacter, 
    deleteCharacter,
    createAccessory,
} from "./api.js"
import { 
    onIndexCharacterSuccess, 
    onFailure, 
    onCreateCharacterSuccess,
	onUpdateCharacterSuccess,
	onDeleteCharacterSuccess,
    refreshEntries,
} from "./ui.js"

const mainPage = document.querySelector('#main-page')
const createUpdatePage = document.querySelector('#create-update-page')
const indexCharacterContainer = document.querySelector('#value-container')

let characterLink1 = document.querySelector('#input-link1')
let characterLink2 = document.querySelector('#input-link2')
let characterLink3 = document.querySelector('#input-link3')

let slot1Lvl = document.querySelector('#input-slot1')
let slot2Lvl = document.querySelector('#input-slot2')
let slot3Lvl = document.querySelector('#input-slot3')

let addingEntry = false
let entryToUpdate

//Checks for what is Entered in Input is a Number
function checkSlotValue(slotLvl){
    if(Number.isInteger(parseInt(slotLvl.value))){
        return slotLvl.value
    }else{
        return 0
    }
}
//Checks for Undefined Slots when Adding in POSTMAN since Slots aren't Required
function checkSlotForUndefined(slot){
    if(slot === undefined){
        return 0
    }else{
        return slot
    }
}
//Checks for Undefined Character Links when Adding in POSTMAN since Links aren't Required
function checkLinkForUndefined(link){
    if(link === undefined){
        return ''
    }else{
        return link
    }
}

indexCharacter()
.then(res => res.json())
.then(res => {
    onIndexCharacterSuccess(res.characters)
})
.catch(onFailure)

//CREATE
document.addEventListener('click', (event) => {
    event.preventDefault()
    //GO TO CREATE/UPDATE PAGE TO ADD
    if(event.target.matches('#add-new-entry-button')){
        addingEntry = true;
        createUpdatePage.style.display = 'block'
        mainPage.style.display = 'none'
        document.querySelectorAll('.input-field').forEach( (event) => {
            event.firstChild.value = '';
        })
    }
    //GO TO CREATE/UPDATE PAGE TO EDIT
    if(event.target.matches('#update-entry')){
        addingEntry = false;
        const id = event.target.getAttribute('data-id')
        entryToUpdate = id;
        createUpdatePage.style.display = 'block'
        mainPage.style.display = 'none'
        showCharacter(id)
        .then((res) => res.json())
        .then((res) => {
            console.log(res.character)
            document.querySelector('#input-name').value = res.character.name
            document.querySelector('#input-attribute').value = res.character.attribute
            document.querySelector('#input-killer').value = res.character.killer
            document.querySelector('#input-soulTrait').value = res.character.soulTrait
            
            characterLink1.value = checkLinkForUndefined(res.character.characterLinks[0])
            characterLink2.value = checkLinkForUndefined(res.character.characterLinks[1])
            characterLink3.value = checkLinkForUndefined(res.character.characterLinks[2])

            slot1Lvl.value = checkSlotForUndefined(res.character.slot1Lvls)
            slot2Lvl.value = checkSlotForUndefined(res.character.slot2Lvls)
            slot3Lvl.value = checkSlotForUndefined(res.character.slot3Lvls)
        })
		.catch(onFailure)
    }
    //Return to MAIN PAGE
    if(event.target.matches('#return-button')){
        indexCharacter()
        .then(res => res.json())
        .then(res => {
            console.log(res.characters)
        })
        .catch(onFailure)
        mainPage.style.display = 'block'
        createUpdatePage.style.display = 'none'
    }
    //CLICKING THE ADD/UPDATE BUTTON ON ADD/UPDATE PAGE
    if(event.target.matches('#add-update-button')){
        //ADDING NEW ENTRY
        if(addingEntry){
            const characterData = {
                character:{
                    name: document.querySelector('#input-name').value,
                    attribute: document.querySelector('#input-attribute').value,
                    killer: document.querySelector('#input-killer').value,
                    soulTrait: document.querySelector('#input-soulTrait').value,
                    accessories: [],
                    characterLinks: [],
                    slot1Lvls: checkSlotValue(slot1Lvl),
                    slot2Lvls: checkSlotValue(slot2Lvl),
                    slot3Lvls: checkSlotValue(slot3Lvl),
                    slotLvls: `${checkSlotValue(slot1Lvl)}/${checkSlotValue(slot2Lvl)}/${checkSlotValue(slot3Lvl)}`
                }
            }
            characterData.character.characterLinks.push(characterLink1.value)
            characterData.character.characterLinks.push(characterLink2.value)
            characterData.character.characterLinks.push(characterLink3.value)

            const accessory1Data = {
                accessory:{
                    name: document.querySelector('#accessory1').value,
                    attribute: document.querySelector('#acc-attribute1').value,
                    effect: document.querySelector('#acc-effect1').value,
                    bonus: document.querySelector('#acc-bonus1').value
                }
            }
            characterData.character.accessories.push(accessory1Data)

            console.log(characterData)

            // createAccessory(accessory1Data)
            
            createCharacter(characterData)
            .then(onCreateCharacterSuccess)
            .catch(onFailure)
        }
        //UPDATING AN EXISTING ENTRY
        else if(!addingEntry){
            console.log(entryToUpdate)
            const characterData = {
                character: {
                    name: document.querySelector('#input-name').value,
                    attribute: document.querySelector('#input-attribute').value,
                    killer: document.querySelector('#input-killer').value,
                    soulTrait: document.querySelector('#input-soulTrait').value,
                    characterLinks: [characterLink1.value, characterLink2.value, characterLink3.value],
                    slot1Lvls: checkSlotValue(slot1Lvl),
                    slot2Lvls: checkSlotValue(slot2Lvl),
                    slot3Lvls: checkSlotValue(slot3Lvl),
                    slotLvls: `${checkSlotValue(slot1Lvl)}/${checkSlotValue(slot2Lvl)}/${checkSlotValue(slot3Lvl)}`
                }
            }
            console.log(characterData)
            updateCharacter(characterData, entryToUpdate)
            .then(onUpdateCharacterSuccess)
            .then(function(){
                refreshEntries(indexCharacterContainer)
                indexCharacter()
                .then(res => res.json())
                .then(res => {
                onIndexCharacterSuccess(res.characters)
                })
            })
            .catch(onFailure)
            mainPage.style.display = 'block'
            createUpdatePage.style.display = 'none'
        }
    }
    //DELETE ENTRY
    if(event.target.matches('#delete-entry')){
        const id = event.target.getAttribute('data-id')
        console.log(id)
	    deleteCharacter(id)
		.then(onDeleteCharacterSuccess)
        .then(function(){
            refreshEntries(indexCharacterContainer)
            indexCharacter()
            .then(res => res.json())
            .then(res => {
            onIndexCharacterSuccess(res.characters)
            })
        })
		.catch(onFailure)
    }
})