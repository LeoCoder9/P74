import React, { Component } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  FlatList,
} from "react-native";
import { Avatar, ListItem, Icon } from "react-native-elements";
import db from "../config";

export default class SearchScreen extends Component {
  constructor() {
    super();
    this.state = {
      allTransactions: [],
      searchText: "",
      lastTransaction: null
    };
  }
  componentDidMount = async () => {
    this.getTransactions();
  };

  getTransactions = () => {
    db.collection("transactions")
      .limit(10)
      .get()
      .then((snapshot) => {
        snapshot.docs.map((doc) => {
          this.setState({
            allTransactions: [...this.state.allTransactions, doc.data()],
            lastTransaction: doc
          });
        });
      });
  };

  renderItem = ({ item, i }) => {
    var date = item.date.toDate().toString().split(" ").splice(0, 4).join(" ");
    console.log(item.date);
    console.log(item.date.toDate());

    var transactionType =
      item.transaction_type === "issue" ? "issued" : "returned";
    return (
      <View style={{ borderWidth: 1 }}>
        <ListItem key={i} bottomDivider>
          <Icon type={"antdesign"} name={"book"} size={40} />
          <ListItem.Content>
            <ListItem.Title style={styles.title}>
              {`${item.book_name} ( ${item.book_id} )`}
            </ListItem.Title>
            <ListItem.Subtitle style={styles.subtitle}>
              {`This book ${transactionType} by ${item.student_name}`}
            </ListItem.Subtitle>
            <View style={styles.lowerLeftContaiiner}>
              <View style={styles.transactionContainer}>
                <Text
                  style={[
                    styles.transactionText,
                    {
                      color:
                        item.transaction_type === "issue"
                          ? "#78D304"
                          : "#0364F4",
                    },
                  ]}
                >
                  {item.transaction_type.charAt(0).toUpperCase() +
                    item.transaction_type.slice(1)}
                </Text>
                <Icon
                  type={"ionicon"}
                  name={
                    item.transaction_type === "issue"
                      ? "checkmark-circle-outline"
                      : "arrow-redo-circle-outline"
                  }
                  color={
                    item.transaction_type === "issue" ? "#78D304" : "#0364F4"
                  }
                />
              </View>
              <Text style={styles.date}>{date}</Text>
            </View>
          </ListItem.Content>
        </ListItem>
      </View>
    );
  };

  handleSearch = async (text) => {
    this.setState({
      allTransactions: [],
    });
    text = text.toUpperCase();

    var firstCharacter = text.split("")[0];

    if (firstCharacter === "B") {
      var transRef = await db
        .collection("transactions")
        .where("book_id", "==", text)
        .get();
      transRef.docs.map((doc) => {
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data()],
        });
      });
    } else if (firstCharacter === "S") {
      var transRef = await db
        .collection("transactions")
        .where("student_id", "==", text)
        .get();
      transRef.docs.map((doc) => {
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data()],
        });
      });
    }
  };
  fetchOtherTransactions = async(text)=>{
    text = text.toUpperCase();

    var firstCharacter = text.split("")[0];

    if (firstCharacter === "B") {
      var transRef = await db
        .collection("transactions")
        .where("book_id", "==", text).startAfter(this.state.lastTransaction)
        .get();
      transRef.docs.map((doc) => {
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data()],
          lastTransaction: doc
        });
      });
    } else if (firstCharacter === "S") {
      var transRef = await db
        .collection("transactions")
        .where("student_id", "==", text).startAfter(this.state.lastTransaction)
        .get();
      transRef.docs.map((doc) => {
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data()],
          lastTransaction: doc
        });
      });
    }
  }
  render() {
    const { searchText, allTransactions } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.upperContainer}>
          <View style={styles.textinputContainer}>
            <TextInput
              style={styles.textinput}
              onChangeText={(text) => this.setState({ searchText: text })}
              placeholder={"Type here"}
              placeholderTextColor={"#FFFFFF"}
            />
            <TouchableOpacity
              style={styles.scanbutton}
              onPress={() => {
                this.handleSearch(searchText);
              }}
            >
              <Text style={styles.scanbuttonText}>Search</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.lowerContainer}>
          <FlatList
            data={allTransactions}
            renderItem={this.renderItem}
            keyExtractor={(item, index) => index.toString()}
            onEndReached = {()=>{
              this.fetchOtherTransactions(searchText)
            }}
            onEndReachedThreshold={0.4}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5653D4",
  },
  upperContainer: {
    flex: 0.2,
    justifyContent: "center",
    alignItems: "center",
  },
  textinputContainer: {
    borderWidth: 2,
    borderRadius: 10,
    flexDirection: "row",
    backgroundColor: "#9DFD24",
    borderColor: "#FFFFFF",
  },
  textinput: {
    width: "57%",
    height: 50,
    padding: 10,
    borderColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 3,
    fontSize: 18,
    backgroundColor: "#5653D4",
    fontFamily: "Rajdhani_600SemiBold",
    color: "#FFFFFF",
  },
  scanbutton: {
    width: 100,
    height: 50,
    backgroundColor: "#9DFD24",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  scanbuttonText: {
    fontSize: 24,
    color: "#0A0101",
    fontFamily: "Rajdhani_600SemiBold",
  },
  lowerContainer: {
    flex: 0.8,
    backgroundColor: "#FFFFFF",
  },
  title: {
    fontSize: 20,
    fontFamily: "Rajdhani_600SemiBold",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Rajdhani_600SemiBold",
  },
  lowerLeftContaiiner: {
    alignSelf: "flex-end",
    marginTop: -40,
  },
  transactionContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  transactionText: {
    fontSize: 20,

    fontFamily: "Rajdhani_600SemiBold",
  },
  date: {
    fontSize: 12,
    fontFamily: "Rajdhani_600SemiBold",
    paddingTop: 5,
  },
});
