import Header from "@/components/header/Header";
import GlobalText from "@/constants/Global_Variables";
import React from "react";
import { View, Text, StyleSheet, ScrollView, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PrivacyPolicy = () => {
  const redirectToGmail = (receiverEmail: string) => {
    const gmailURL = `mailto:${receiverEmail}`;

    Linking.canOpenURL(gmailURL)
      .then((supported) => {
        if (supported) {
          Linking.openURL(gmailURL);
        } else {
          // Fallback to web URL
          Linking.openURL(
            `https://mail.google.com/mail/?view=cm&fs=1&to=${receiverEmail}`
          );
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header title={"Privacy Policy"} goBack />
      <ScrollView style={styles.container}>
        <Text style={styles.paragraph}>
          This privacy policy applies to the{" "}
          <Text style={{ fontWeight: "bold" }}>Muslims Prayer app </Text>
          (hereby referred to as "Application") for mobile devices that was
          created by{" "}
          <Text style={{ fontWeight: "bold" }}>Sheakh App Studio</Text> (hereby
          referred to as "Service Provider") as a Free service. This service is
          intended for use "AS IS".
        </Text>

        <Text style={styles.subHeader}>Information Collection and Use</Text>
        <Text style={styles.paragraph}>
          The Application collects information when you download and use it.
          This information may include information such as:
        </Text>
        <Text style={styles.bulletPoint}>
          • Your device's Internet Protocol address (e.g., IP address)
        </Text>
        <Text style={styles.bulletPoint}>
          • The pages of the Application that you visit, the time and date of
          your visit, the time spent on those pages
        </Text>
        <Text style={styles.bulletPoint}>
          • The time spent on the Application
        </Text>
        <Text style={styles.bulletPoint}>
          • The operating system you use on your mobile device
        </Text>
        <Text style={styles.paragraph}>
          The Application does not gather precise information about the location
          of your mobile device.
        </Text>
        <Text style={styles.paragraph}>
          The Service Provider may use the information you provided to contact
          you from time to time to provide you with important information,
          required notices, and marketing promotions.
        </Text>

        <Text style={styles.subHeader}>Third Party Access</Text>
        <Text style={styles.paragraph}>
          Only aggregated, anonymized data is periodically transmitted to
          external services to aid the Service Provider in improving the
          Application and their service. The Service Provider may share your
          information with third parties in the ways that are described in this
          privacy statement.
        </Text>
        <Text style={styles.paragraph}>
          Please note that the Application utilizes third-party services that
          have their own Privacy Policy about handling data. Below are the links
          to the Privacy Policy of the third-party service providers used by the
          Application:
        </Text>
        <Text style={styles.bulletPoint}>• Google Play Services</Text>
        <Text style={styles.bulletPoint}>• One Signal</Text>

        <Text style={styles.subHeader}>Opt-Out Rights</Text>
        <Text style={styles.paragraph}>
          You can stop all collection of information by the Application easily
          by uninstalling it. You may use the standard uninstall processes as
          may be available as part of your mobile device or via the mobile
          application marketplace or network.
        </Text>

        <Text style={styles.subHeader}>Data Retention Policy</Text>
        <Text style={styles.paragraph}>
          The Service Provider will retain User Provided data for as long as you
          use the Application and for a reasonable time thereafter. If you'd
          like them to delete User Provided Data that you have provided via the
          Application, please contact them at{" "}
          <Text
            style={{ color: "blue", textDecorationLine: "underline" }}
            onPress={() => redirectToGmail(GlobalText.email)}
          >
            {`${GlobalText.email}`}
          </Text>{" "}
          and they will respond in a reasonable time.
        </Text>

        <Text style={styles.subHeader}>Children</Text>
        <Text style={styles.paragraph}>
          The Service Provider does not use the Application to knowingly solicit
          data from or market to children under the age of 13. The Application
          does not address anyone under the age of 13. If you are a parent or
          guardian and you are aware that your child has provided personal
          information, please contact the Service Provider at
          <Text
            style={{ color: "blue", textDecorationLine: "underline" }}
            onPress={() => redirectToGmail(GlobalText.email)}
          >
            {`${GlobalText.email}`}
          </Text>{" "}
          to take the necessary actions.
        </Text>

        <Text style={styles.subHeader}>Security</Text>
        <Text style={styles.paragraph}>
          The Service Provider is concerned about safeguarding the
          confidentiality of your information. The Service Provider provides
          physical, electronic, and procedural safeguards to protect information
          the Service Provider processes and maintains.
        </Text>

        <Text style={styles.subHeader}>Changes</Text>
        <Text style={styles.paragraph}>
          This Privacy Policy may be updated from time to time for any reason.
          The Service Provider will notify you of any changes to the Privacy
          Policy by updating this page. You are advised to consult this Privacy
          Policy regularly for any changes, as continued use is deemed approval
          of all changes.
        </Text>

        <Text style={styles.paragraph}>
          This privacy policy is effective as of 2024-10-30.
        </Text>

        <Text style={styles.subHeader}>Your Consent</Text>
        <Text style={styles.paragraph}>
          By using the Application, you are consenting to the processing of your
          information as set forth in this Privacy Policy now and as amended by
          us.
        </Text>

        <Text style={styles.subHeader}>Contact Us</Text>
        <Text style={[styles.paragraph, { marginBottom: 50 }]}>
          If you have any questions regarding privacy while using the
          Application, or have questions about our practices, please contact the
          Service Provider via email at{" "}
          <Text
            style={{ color: "blue", textDecorationLine: "underline" }}
            onPress={() => redirectToGmail(GlobalText.email)}
          >
            {`${GlobalText.email}`}
          </Text>
          .
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 22,
  },
  bulletPoint: {
    fontSize: 16,
    marginLeft: 16,
    lineHeight: 22,
  },
});

export default PrivacyPolicy;
