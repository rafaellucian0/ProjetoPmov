import AsyncStorage from '@react-native-async-storage/async-storage';

const getMateria = async () => {
    try {
        const disciplinasStr = await AsyncStorage.getItem("disciplinas");
        return (JSON.parse(disciplinasStr));
    } catch(e) {
        console.log(e);
    }
}

const addMateria = async (id, title, horas) => {
    try {
        const disciplinasStr = await AsyncStorage.getItem("disciplinas");
        let disciplinas = JSON.parse(disciplinasStr);
        
        if(title!=="" && horas !=="" && isNaN(title) && !isNaN(horas[0]) && isNaN(title[0]) && isNaN(title[1]) && isNaN(title[2]) ){
        if(disciplinas === null || disciplinas.length<1){
            disciplinas=[
                { "id": "1", "title": "Português", "horas": "2 horas" },
            ]
            await AsyncStorage.setItem("disciplinas", JSON.stringify(disciplinas));
        }

        if (disciplinas !== null){
            if(id!="" || id!=null || id!=undefined){
            disciplinas.push({
                "id": parseInt(disciplinas[disciplinas.length - 1].id) + 1,
                "title": title,
                "horas": horas})
            }

            else{
                disciplinas.push({
                    "id": 1,
                    "title": title,
                    "horas": horas})
                }
        };

        await AsyncStorage.setItem("disciplinas", JSON.stringify(disciplinas));}
        return (disciplinas);
    } catch(e) {
        console.log(e);
    }
}

const removeMateria = async (id) => {
    try {
        const disciplinasStr = await AsyncStorage.getItem("disciplinas");
        let disciplinas = JSON.parse(disciplinasStr);
        let index = -1;

        for(let i = 0; i<disciplinas.length;i++){
            let disciplina = disciplinas[i];
            if(disciplina.id === id){
                index = i
            }
        }
        if (index !== -1){
            disciplinas.splice(index, 1)
        }
        await AsyncStorage.setItem("disciplinas", JSON.stringify(disciplinas));
        return (disciplinas);
    } catch(e) {
        console.log(e);
    } 
}

export { getMateria, addMateria, removeMateria }