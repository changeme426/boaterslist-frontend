import { Text, View, StyleSheet } from 'react-native'
import { useForm, Controller } from "react-hook-form";
import { Button, Input } from 'react-native-elements';

export function UserProfileForm() {
  const { control, handleSubmit, formState: { errors } } = useForm({
    // defaultValues: {
    //   firstName: '',
    //   lastName: ''
    // }
  });

  const onSubmit = data => console.log(data);

  return (
    <View>
      <Controller
        control={control}
        // rules={{
        //   required: true,
        // }}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            errorStyle={{ height: 0 }}
            label={'First Name'}
            labelStyle={styles.labelStyles}
            inputContainerStyle={styles.inputStyles}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="firstName"
      />

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
          errorStyle={{ height: 0 }}
            label={'Last Name'}
            labelStyle={styles.labelStyles}
            inputContainerStyle={styles.inputStyles}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="lastName"
      />

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
          errorStyle={{ height: 0 }}
            label={'Phone Number'}
            labelStyle={styles.labelStyles}
            inputContainerStyle={styles.inputStyles}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="phoneNumber"
      />

      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
          errorStyle={{ height: 0 }}
            label={'Zip'}
            labelStyle={styles.labelStyles}
            inputContainerStyle={styles.inputStyles}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
        name="zipCode"
      />

      <Button buttonStyle={styles.btnStyle} containerStyle={styles.buttonContainerStyles} title="Save Profile" onPress={handleSubmit(onSubmit)} />
      <Button buttonStyle={styles.btnStyle} containerStyle={styles.buttonShowBusiness} title="Show my Businesses" onPress={()=>{}} />
    </View>
  );
}

const styles = StyleSheet.create({
  inputStyles: {
    borderRadius: 5,
    marginVertical: 0,
    padding: 0,
    margin: 0
  },
  labelStyles: {
    paddingLeft: 30,
    marginVertical: 0,
    margin: 0,
    padding: 0
  },
  buttonContainerStyles: {
    marginHorizontal: 35,
    marginVertical: 0,
  },
  buttonShowBusiness:{
    marginHorizontal: 35,
    marginVertical: 10,
  },
  btnStyle: {
    borderWidth: 2,
    borderRadius: 30,
  }
});
