import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Input, Button } from "react-native-elements";
import * as firebase from "firebase";
import { reauthenticate } from "../../utils/Api";
import  * as URLs from "../../../assets/constants/fetchs"

export default function ChageEmailForm(props) {
  const { email, setIsVisibleModal, setReloadData, toastRef } = props;
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const [hidePassword, setHidePassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);


  const updateEmailApi = (idUser) => {
    fetch(`${URLs.HEROKU_URL}/api/usuario/${idUser}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: idUser,
        email: newEmail,
        createAt: Date.now(),
      
      }),
    });
  }
  const updateEmail = () => {
    setError({});
    if (!newEmail || email === newEmail) {
      setError({ email: "El email no puede ser igual o esta vacio" });
    } else {
      setIsLoading(true);
      reauthenticate(password)
        .then(() => {
          firebase
            .auth()
            .currentUser.updateEmail(newEmail)
            .then(() => {
              setIsLoading(false);
              updateEmailApi(firebase
                .auth()
                .currentUser.uid);
              setReloadData(true);
              setIsVisibleModal(false);
            })
            .catch(() => {
              setError({ email: "Error al actualiza el email" });
              setIsLoading(false);
            });
        })
        .catch(() => {
          setError({ password: "La contraseña no es correcta" });
          setIsLoading(false);
        });
    }
  };

  return (
    <View style={style.view}>
      <Input
        placeholder="Correo electronico"
        containerStyle={style.input}
        defaultValue={email && email}
        onChange={e => setNewEmail(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: "at",
          color: "#c2c2c2"
        }}
        errorMessage={error.email}
      />
      <Input
        placeholder="Contraseña"
        containerStyle={style.input}
        password={true}
        secureTextEntry={hidePassword}
        onChange={e => setPassword(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: hidePassword ? "eye-outline" : "eye-off-outline",
          color: "#c2c2c2",
          onPress: () => setHidePassword(!hidePassword)
        }}
        errorMessage={error.password}
      />
      <Button
        title="Cambiar email"
        containerStyle={style.btnContainer}
        buttonStyle={style.btn}
        onPress={updateEmail}
        loading={isLoading}
      />
    </View>
  );
}
const style = StyleSheet.create({
  view: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10
  },
  input: {
    marginBottom: 10,
    marginTop: 10
  },
  btnContainer: {
    marginTop: 10,
    width: "95%"
  },
  btn: {
    backgroundColor: "#00a680"
  }
});
