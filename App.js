import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, FlatList, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { getMateria, addMateria, removeMateria } from './services/DisciplinaService';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icon } from 'react-native-elements';

export default function App() {
  
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  const getMateriaFromService = () => {
    getMateria().then(result => {
      setData(result);
    })
    .catch(error => {
      console.log(error)
    })
    .finally (()=>{
      setLoading(false);
    });
  }

  useEffect(() => {
    getMateriaFromService();
  }, []);

  const removeMateriaFromService = async (id) =>{
    await removeMateria(id);
    getMateriaFromService();
  }

  const Item = ({id, title, horas}) => (
    <View style={styles.item}>
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text>{horas}</Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity onPress={()=>{removeMateriaFromService(id)}}>
          <Ionicons name={'trash-outline'} size={30} color={'black'}/>
        </TouchableOpacity>
      </View>
    </View>
  );

  const Disciplinas = () => {
    const navigation = useNavigation();
    return(
      <View style={styles.container}>
        {isLoading ? <ActivityIndicator/> : (
        <FlatList
            data={data}
            keyExtractor={({id}, index)=>id}
            renderItem={({item}) => (
              <Item id={item.id} title={item.title} horas={item.horas} updateList={getMateriaFromService}/>
              )}
            />
          )}
            <TouchableOpacity
              style={styles.floatButton} onPress={()=>{navigation.navigate("Adicionar",{update: setData})}}>
              <Ionicons name={'add'} size={30} color={'black'} />
            </TouchableOpacity>
      </View>
    )
  }

  const alerta = () =>{
    Alert.alert(
      'A matéria não será adicionada se:',
      'Alguma caixa de texto ficar vazia ou o nome da matéria for apenas um número',
      [
        {
          text: 'Concluído',
        },
      ],
      {cancelable: false},
    );
  }

  const Adicionar = () => {
    const navigation= useNavigation();
    const [id, Id] = useState("");
    const [title, setTitle] = useState("");
    const [horas, setHoras] = useState("");

    const addMateriaFromService = () => {
      addMateria(id, title, horas).then(result => {
        setData(result);
        navigation.goBack();

      }).catch(error => {
        console.log(error);
        })
    }
    return(
      <View style={styles.add}>
      <TouchableOpacity style={{alignItems: "flex-start"}} onPress={()=>{alerta()}}>
        <Icon name={'info'} size={30} /></TouchableOpacity>
        <Text style={{fontSize: 24, paddingBottom: 20, marginTop: 20}}>Digite os dados da matéria</Text>
        <TextInput
        style={styles.caixa}
          onChangeText={setTitle}
          value={title}
          placeholder="Digite o nome da matéria"
      />
      <TextInput
        style={styles.caixa}
          onChangeText={setHoras}
          value={horas}
          placeholder="Digite as horas de estudo"
      />
      <TouchableOpacity style={{alignItems: "center", backgroundColor: "black", padding: 20}} onPress={()=>{addMateriaFromService()}}><Text style={{color:"white", fontSize:17}}>Adicionar Matéria</Text></TouchableOpacity>
      
      </View>
    )
  }

  const Stack = createNativeStackNavigator();

    return(
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Disciplinas" component={Disciplinas}></Stack.Screen>
          <Stack.Screen name="Adicionar" component={Adicionar}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    backgroundColor: "white",
  },
    item: {
      borderColor: "black",
      borderWidth: 3,
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
      alignItems: "center", 
      flexDirection: "row", 
      justifyContent:"space-between",
    },
    add:{
      flex: 1,
      flexDirection: 'column',
      padding: 20,
    },
    caixa:{
      padding: 15,
      borderWidth: 3,
      marginVertical: 8,
    },
    title: {
      fontSize: 32,
    },
    floatButton: {
      borderWidth: 2,
      borderColor: 'black',
      alignItems: 'center',
      justifyContent: 'center',
      width: 70,
      position: 'absolute',
      bottom: 10,
      right: 16,
      height: 70,
      backgroundColor: '#fff',
      borderRadius: 1,
    }
  },
);
