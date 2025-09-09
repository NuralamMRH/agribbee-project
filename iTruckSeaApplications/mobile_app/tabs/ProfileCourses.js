import { StyleSheet, FlatList } from "react-native";
import React from "react";
import { ScrollView } from "react-native-virtualized-view";
import CourseCard from "../components/BoatCard";
import { mentorInfo } from "../data";
import { router } from "expo-router";

const ProfileCourses = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
      <FlatList
        data={mentorInfo.boats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <CourseCard
              name={item.name}
              image={item.image}
              category={item.category}
              price={item.price}
              isOnDiscount={item.isOnDiscount}
              oldPrice={item.oldPrice}
              rating={item.rating}
              numStudents={item.numStudents}
              onPress={() => router.push("/CourseDetailsMore")}
              categoryId={item.categoryId}
            />
          );
        }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
});

export default ProfileCourses;
