import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { VStack, Text, HStack, useTheme, ScrollView, Box } from "native-base";
import { useNavigation, useRoute } from "@react-navigation/native";
import firestore from "@react-native-firebase/firestore";
import { OrderFirestoreDTO } from "../DTOs/OrderFirestoreDTO";
import {
  CircleWavyCheck,
  Hourglass,
  ClipboardText,
  User,
  Wrench,
  Person,
} from "phosphor-react-native";

import { dateFormat } from "../utils/firestoreDateFormat";

import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { OrderProps } from "../components/Order";
import { Loading } from "../components/Loading";
import { CardDetails } from "../components/CardDetails";

type RouteParams = {
  orderId: string;
};

type OrderDetails = OrderProps & {
  description: string;
  client: string;
  technician: string;
  solution: string;
  closed: string;
};

export function Details() {
  const [solution, setSolution] = useState("");
  const [technician, setTechnician] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);

  const navigation = useNavigation();
  const route = useRoute();
  const { colors } = useTheme();

  const { orderId } = route.params as RouteParams;

  function handleOrderClose() {
    if (!technician) {
      return Alert.alert("Atenção", "Informar responsavel pela manutenção");
    }

    if (!solution) {
      return Alert.alert(
        "Atenção",
        "Informar a solução para encerrar a solicitação"
      );
    }

    firestore()
      .collection<OrderFirestoreDTO>("orders")
      .doc(orderId)
      .update({
        status: "closed",
        technician,
        solution,
        closed_at: firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        Alert.alert("Solicitação", "Solicitação encerrada.");
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error);
        Alert.alert("Solicitação", "Não foi possível encerrar a solicitação");
      });
  }

  useEffect(() => {
    firestore()
      .collection<OrderFirestoreDTO>("orders")
      .doc(orderId)
      .get()
      .then((doc) => {
        const {
          patrimony,
          client,
          address,
          description,
          technician,
          status,
          created_at,
          closed_at,
          solution,
        } = doc.data();

        const closed = closed_at ? dateFormat(closed_at) : null;

        setOrder({
          id: doc.id,
          client,
          address,
          patrimony,
          description,
          technician,
          status,
          solution,
          when: dateFormat(created_at),
          closed,
        });

        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bg="gray.800">
      <Box px={6} bg="gray.800">
        <Header title="Ordem de serviço" />
      </Box>

      <HStack bg="gray.800" justifyContent="center" p={4}>
        {order.status === "closed" ? (
          <CircleWavyCheck size={22} color={colors.green[300]} />
        ) : (
          <Hourglass size={22} color={colors.secondary[700]} />
        )}

        <Text
          fontSize="sm"
          color={
            order.status === "closed"
              ? colors.green[300]
              : colors.secondary[700]
          }
          ml={2}
          textTransform="uppercase"
        >
          {order.status === "closed" ? "finalizado" : "em andamento"}
        </Text>
      </HStack>

      <ScrollView mx={5} showsVerticalScrollIndicator={false}>
        <CardDetails
          title="manutenção"
          description={`Equipamento: ${order.patrimony}`}
          icon={Wrench}
        />

        <CardDetails
          title="cliente"
          description={`nome: ${order.client}`}
          icon={User}
        />

        <CardDetails
          title="descrição do problema"
          description={order.description}
          icon={ClipboardText}
          footer={`Registrado em ${order.when}`}
        />

        <CardDetails
          title="técnico responsavel"
          icon={Person}
          description={order.technician}
        >
          {order.status === "open" && (
            <Input
              placeholder="Colaborador"
              onChangeText={setTechnician}
              textAlignVertical="top"
              multiline
              h={24}
            />
          )}
        </CardDetails>

        <CardDetails
          title="solução"
          icon={CircleWavyCheck}
          description={order.solution}
          footer={order.closed && `Encerrado em ${order.closed}`}
        >
          {order.status === "open" && (
            <Input
              placeholder="Descrição da solução"
              onChangeText={setSolution}
              textAlignVertical="top"
              multiline
              h={24}
            />
          )}
        </CardDetails>
      </ScrollView>

      {order.status === "open" && (
        <Button title="Encerrar solicitação" m={5} onPress={handleOrderClose} />
      )}
    </VStack>
  );
}
