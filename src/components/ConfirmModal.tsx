import React from 'react';
import { Modal, View, Text, Button } from 'react-native';

export default function ConfirmModal({ visible, title, message, onConfirm, onCancel }:{ visible: boolean; title?: string; message?: string; onConfirm: () => void; onCancel: () => void }){
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.5)' }}>
        <View style={{ width:300, padding:20, backgroundColor:'#fff', borderRadius:8 }}>
          <Text style={{ fontWeight:'bold', marginBottom:8 }}>{title || 'Confirmar'}</Text>
          <Text style={{ marginBottom:16 }}>{message || 'Tem certeza?'}</Text>
          <View style={{ flexDirection:'row', justifyContent:'flex-end' }}>
            <Button title="Cancelar" onPress={onCancel} />
            <View style={{ width:8 }} />
            <Button title="Confirmar" onPress={onConfirm} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
