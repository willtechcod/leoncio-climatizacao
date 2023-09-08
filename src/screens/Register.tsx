import { useState } from "react";
import { Alert } from "react-native";
import { ScrollView, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [client, setClient] = useState("");
  const [address, setAddress] = useState("");
  const [patrimony, setPatrimony] = useState("");
  const [description, setDescription] = useState("");

  const navigation = useNavigation();

  function handleNewOrderRegister() {
    if (!patrimony || !client || !address || !description) {
      return Alert.alert("Registrar", "Preencha todos os campos.");
    }

    setIsLoading(true);

    firestore()
      .collection("orders")
      .add({
        patrimony,
        client,
        address,
        description,
        status: "open",
        created_at: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        Alert.alert("Solicitação", "Visita agendada com sucesso.");
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
        return Alert.alert(
          "Solicitação",
          "Não foi possível registrar o pedido"
        );
      });
  }

  return (
    <VStack flex={1} p={6} bg="gray.800">
      <Header title="Solicitação de visita" />
      <ScrollView mx={2} showsVerticalScrollIndicator={false}>
        <Input placeholder="Equipamento:" mt={4} onChangeText={setPatrimony} />
        <Input placeholder="Cliente:" mt={4} onChangeText={setClient} />
        <Input placeholder="Endereço:" mt={4} onChangeText={setAddress} />

        <Input
          placeholder="Descrição do problema"
          flex={1}
          mt={5}
          multiline
          textAlignVertical="top"
          onChangeText={setDescription}
        />
      </ScrollView>
      <Button
        title="Cadastrar"
        mt={5}
        isLoading={isLoading}
        onPress={handleNewOrderRegister}
      />
    </VStack>
  );
}
