import { FlatList } from "react-native";

interface propsType {
  children?: React.ReactNode;
}

const VirtualizedList: React.FC<propsType> = ({ children }) => {
  return (
    <FlatList
      keyboardShouldPersistTaps={"handled"}
      data={[]}
      keyExtractor={() => "key"}
      renderItem={null}
      ListHeaderComponent={<>{children}</>}
    />
  );
};

export default VirtualizedList;
