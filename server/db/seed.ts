import { db } from './index';
import { stories } from './schema';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });


const SEED_STORIES = [
  {
    title: "RBI’s Repo Rate Stance: What it means for your Home Loan EMI",
    titleHi: "RBI का रेपो रेट रुख: आपके होम लोन ईएमआई के लिए इसका क्या मतलब है",
    category: "Monetary Policy",
    categoryHi: "मौद्रिक नीति",
    readTime: "5 MIN READ",
    readTimeHi: "5 मिनट की पढ़ाई",
    updateInfo: "Personalized for you • Breaking",
    updateInfoHi: "आपके लिए व्यक्तिगत • ब्रेकिंग",
    insights: [
      "The RBI has maintained the repo rate at 6.5%, focusing on 'withdrawal of accommodation'.",
      "Banks are expected to keep MCLR rates stable, providing temporary relief to floating-rate borrowers.",
      "Inflation remains a key concern, with food prices keeping the MPC on high alert."
    ],
    insightsHi: [
      "RBI ने रेपो रेट को 6.5% पर बरकरार रखा है, 'समायोजन की वापसी' पर ध्यान केंद्रित किया है।",
      "बैंकों से MCLR दरों को स्थिर रखने की उम्मीद है, जिससे फ्लोटिंग-रेट उधारकर्ताओं को अस्थायी राहत मिलेगी।",
      "मुद्रास्फीति एक प्रमुख चिंता बनी हुई है, खाद्य कीमतें MPC को हाई अलर्ट पर रख रही हैं।"
    ],
    mattersToYou: "Based on your personalized profile and interest in \"Indian Real Estate\", this pause suggests a window of stability for your upcoming property investment in Bangalore.",
    mattersToYouHi: "आपकी व्यक्तिगत प्रोफ़ाइल और \"भारतीय रियल एस्टेट\" में रुचि के आधार पर, यह ठहराव बैंगलोर में आपके आगामी संपत्ति निवेश के लिए स्थिरता की खिड़की का सुझाव देता है।",
    tags: ["RBI", "EMI", "ECONOMY", "INDIA"],
    imageUrl: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=1000",
    content: "The Reserve Bank of India's Monetary Policy Committee (MPC) has once again decided to keep the policy repo rate unchanged at 6.50%. This decision, while expected by most economists, carries significant weight for the Indian middle class, particularly those with home loans.\n\nGovernor Shaktikanta Das emphasized that while the Indian economy is showing robust growth, the fight against inflation is far from over. \"The elephant has gone for a walk,\" he noted, referring to inflation, but warned that it could return if vigilance is lowered.\n\nFor the average borrower, this means that EMIs are unlikely to decrease in the immediate future. However, the stability provides a predictable environment for financial planning. Analysts suggest that any rate cuts might only be considered in the second half of the fiscal year, depending on the monsoon's impact on food inflation.",
    contentHi: "भारतीय रिजर्व बैंक की मौद्रिक नीति समिति (MPC) ने एक बार फिर नीतिगत रेपो दर को 6.50% पर अपरिवर्तित रखने का निर्णय लिया है। यह निर्णय, हालांकि अधिकांश अर्थशास्त्रियों द्वारा अपेक्षित था, भारतीय मध्यम वर्ग के लिए महत्वपूर्ण वजन रखता है, विशेष रूप से उन लोगों के लिए जिनके पास होम लोन है।\n\nगवर्नर शक्तिकांत दास ने जोर देकर कहा कि हालांकि भारतीय अर्थव्यवस्था मजबूत विकास दिखा रही है, लेकिन मुद्रास्फीति के खिलाफ लड़ाई अभी खत्म नहीं हुई है। \"हाथी टहलने गया है,\" उन्होंने मुद्रास्फीति का जिक्र करते हुए कहा, लेकिन चेतावनी दी कि अगर सतर्कता कम की गई तो यह वापस आ सकता है।\n\nऔसत उधारकर्ता के लिए, इसका मतलब है कि निकट भविष्य में ईएमआई कम होने की संभावना বৃত্তি है। हालांकि, स्थिरता वित्तीय योजना के लिए एक पूर्वानुमेय वातावरण प्रदान करती है। विश्लेषकों का सुझाव है कि मानसून के खाद्य मुद्रास्फीति पर प्रभाव के आधार पर, वित्त वर्ष की दूसरी छमाही में ही किसी भी दर कटौती पर विचार किया जा सकता है।"
  },
  {
    title: "Nifty 50 hits record high: Is the Indian bull run sustainable?",
    titleHi: "निफ्टी 50 रिकॉर्ड ऊंचाई पर: क्या भारतीय बुल रन टिकाऊ है?",
    category: "Equity Markets",
    categoryHi: "इक्विटी बाजार",
    readTime: "6 MIN READ",
    readTimeHi: "6 मिनट की पढ़ाई",
    updateInfo: "Personalized Insight",
    updateInfoHi: "व्यक्तिगत अंतर्दृष्टि",
    insights: [
      "Domestic institutional investors (DIIs) have pumped in over ₹25,000 crore this month.",
      "The manufacturing sector's PMI reached a 16-year high, signaling strong underlying growth.",
      "Global brokerage firms have upgraded India's weightage in their emerging market portfolios."
    ],
    insightsHi: [
      "घरेलू संस्थागत निवेशकों (DII) ने इस महीने ₹25,000 करोड़ से अधिक का निवेश किया है।",
      "विनिर्माण क्षेत्र का PMI 16 साल के उच्च स्तर पर पहुंच गया, जो मजबूत अंतर्निहित विकास का संकेत देता है।",
      "वैश्विक ब्रोकरेज फर्मों ने अपने उभरते बाजार पोर्टफोलियो में भारत का वेटेज बढ़ाया है।"
    ],
    mattersToYou: "You recently tracked \"Nifty IT Index\". This personalized update indicates that while the broader market is at a peak, IT stocks are still trading at attractive valuations relative to their 5-year average.",
    mattersToYouHi: "आपने हाल ही में \"निफ्टी आईटी इंडेक्स\" को ट्रैक किया है। यह व्यक्तिगत अपडेट इंगित करता है कि जबकि व्यापक बाजार चरम पर है, आईटी स्टॉक अभी भी अपने 5 साल के औसत के सापेक्ष आकर्षक मूल्यांकन पर कारोबार कर रहे हैं।",
    tags: ["NIFTY", "STOCK MARKET", "INVESTING"],
    imageUrl: "https://images.unsplash.com/photo-1611974717484-7da00ff12991?auto=format&fit=crop&q=80&w=1000",
    content: "The Indian stock market continues its relentless climb, with the Nifty 50 and Sensex hitting fresh all-time highs. This rally is driven by a combination of strong corporate earnings, robust domestic liquidity, and a positive outlook on the Indian economy's long-term growth trajectory.\n\nRetail participation through SIPs (Systematic Investment Plans) has reached record levels, providing a stable floor for the markets even during global volatility. However, some analysts are sounding a note of caution, pointing to high valuations in the mid-cap and small-cap segments.\n\n\"The India story is structural, not just cyclical,\" says a leading fund manager. \"While short-term corrections are always possible, the long-term trend remains firmly upward as India moves toward becoming the world's third-largest economy.\"",
    contentHi: "भारतीय शेयर बाजार अपनी निरंतर चढ़ाई जारी रखे हुए है, निफ्टी 50 और सेंसेक्स नई सर्वकालिक ऊंचाई पर पहुंच गए हैं। यह रैली मजबूत कॉर्पोरेट आय, मजबूत घरेलू तरलता और भारतीय अर्थव्यवस्था के दीर्घकालिक विकास पथ पर सकारात्मक दृष्टिकोण के संयोजन से प्रेरित है।\n\nSIP (सिस्टमैटिक इन्वेस्टमेंट प्लान) के माध्यम से खुदरा भागीदारी रिकॉर्ड स्तर पर पहुंच गई है, जो वैश्विक अस्थिरता के दौरान भी बाजारों के लिए एक स्थिर आधार प्रदान करती है। हालांकि, कुछ विश्लेषक सावधानी बरत रहे हैं, मिड-कैप और स्मॉल-कैप सेगमेंट में उच्च मूल्यांकन की ओर इशारा कर रहे हैं।\n\n\"इंडिया स्टोरी संरचनात्मक है, न कि केवल चक्रीय,\" एक प्रमुख फंड मैनेजर कहते हैं। \"जबकि अल्पकालिक सुधार हमेशा संभव होते हैं, दीर्घकालिक प्रवृत्ति मजबूती से ऊपर की ओर बनी हुई है क्योंकि भारत दुनिया की तीसरी सबसे बड़ी अर्थव्यवस्था बनने की ओर बढ़ रहा है।\""
  },
  {
    title: "The Rise of Fintech in Tier 2 India: Beyond UPI",
    titleHi: "टियर 2 भारत में फिनटेक का उदय: UPI से परे",
    category: "Fintech",
    categoryHi: "फिनटेक",
    readTime: "4 MIN READ",
    readTimeHi: "4 मिनट की पढ़ाई",
    updateInfo: "Personalized Trend",
    updateInfoHi: "व्यक्तिगत रुझान",
    insights: [
      "Digital lending startups are seeing a 40% year-on-year growth in non-metro cities.",
      "The focus is shifting from simply payments (UPI) to credit access and wealth management.",
      "Regulatory frameworks like the Account Aggregator network are playing a crucial role."
    ],
    insightsHi: [
      "डिजिटल लेंडिंग स्टार्टअप गैर-मेट्रो शहरों में साल-दर-साल 40% की वृद्धि देख रहे हैं।",
      "फोकस केवल भुगतान (UPI) से क्रेडिट एक्सेस और वेल्थ मैनेजमेंट की ओर स्थानांतरित हो रहा है।",
      "अकाउंट एग्रीगेटर नेटवर्क जैसे नियामक ढांचे एक महत्वपूर्ण भूमिका निभा रहे हैं।"
    ],
    mattersToYou: "Since you follow \"Indian Startups\", building solutions for Bharat (Tier 2/3 India) presents the next massive total addressable market (TAM) for fintech innovation.",
    mattersToYouHi: "चूंकि आप \"भारतीय स्टार्टअप\" को फॉलो करते हैं, इसलिए भारत (टियर 2/3 भारत) के लिए समाधान बनाना फिनटेक नवाचार के लिए अगला विशाल कुल पता योग्य बाजार (TAM) प्रस्तुत करता है।",
    tags: ["FINTECH", "STARTUPS", "BHARAT"],
    imageUrl: "https://images.unsplash.com/photo-1556742049-02e49f9d2a10?auto=format&fit=crop&q=80&w=1000",
    content: "While UPI has indisputably revolutionized payments across the country, the next wave of fintech innovation is happening beyond the metros.\n\nStartups are now focusing on providing tailored credit solutions and wealth management tools for the \"Next Half Billion\" users in Tier 2 and Tier 3 cities. This shift is driven by increasing smartphone penetration and the availability of granular financial data through the Account Aggregator (AA) framework.\n\nDigital lending is growing rapidly, filling the gap left by traditional banks in these underserviced markets. The challenge now lies in managing risk and ensuring responsible lending practices as these companies scale.",
    contentHi: "जहां UPI ने निश्चित रूप से देश भर में भुगतान में क्रांति ला दी है, वहीं फिनटेक नवाचार की अगली लहर महानगरों से परे हो रही है।\n\nस्टार्टअप अब टियर 2 और टियर 3 शहरों में 'अगले हाफ बिलियन' उपयोगकर्ताओं के लिए अनुरूप क्रेडिट समाधान और वेल्थ मैनेजमेंट उपकरण प्रदान करने पर ध्यान केंद्रित कर रहे हैं। यह बदलाव स्मार्टफोन के बढ़ते प्रसार और अकाउंट एग्रीगेटर (AA) ढांचे के माध्यम से विस्तृत वित्तीय डेटा की उपलब्धता से प्रेरित है।\n\nडिजिटल उधार तेजी से बढ़ रहा है, जो इन कम सुविधा वाले बाजारों में पारंपरिक बैंकों द्वारा छोड़े गए अंतर को भर रहा है। अब चुनौती जोखिम का प्रबंधन करने और इन कंपनियों के विस्तार के साथ जिम्मेदार उधार प्रथाओं को सुनिश्चित करने में है।"
  }
];

async function seed() {
  console.log("Starting database seed...");
  try {
    for (const story of SEED_STORIES) {
      await db.insert(stories).values(story);
      console.log(`Inserted story: ${story.title}`);
    }
    console.log("Database seed completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();
