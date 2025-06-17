import axios from "axios";
import {
  GET_ALL_PERSON_GROUP,
  GET_PERSON_GROUP_BY_ID,
  GET_IMAGE_LIST_BY_ID,
  GET_DOCUMENT_LIST_BY_ID,
  GET_PERSON_BY_ID,
  GET_POSITION_LIST_BY_ID,
  GET_TOUR_LIST_BY_ID,
  GET_AUDIO_LIST_BY_ID,
  GET_VIDEO_LIST_BY_ID,
  GET_ARTICLE_LIST_BY_ID
} from "@/api/const";

export const fetchGenralArticleInfo = async (store, topicId) => {
  try {
    const response = await axios.get(
      store.api + GET_ARTICLE_LIST_BY_ID + topicId + "/"
    );

    // Process article_list with proper async handling
    const processedArticleList = await Promise.all(
      response.data.article_list.map(async (item) => {
        const processedItem = {
          ...item,
          image_list: [],
          video_list: [],
          audio_list: [],
          tour_list: [],
          artifact_list: [],
          document_list: [],
          position_list: []
        };

        // Fetch image lists
        if (item.image_folder && item.image_folder.length > 0) {
          const imagePromises = item.image_folder.map(folderId => 
            fetchArticleImageFolder(store, folderId)
          );
          const imageLists = await Promise.all(imagePromises);
          processedItem.image_list = imageLists.flat().filter(Boolean);
        }

        // Fetch audio lists
        if (item.audio_folder && item.audio_folder.length > 0) {
          const audioPromises = item.audio_folder.map(folderId => 
            fetchArticleAudio(store, folderId)
          );
          const audioLists = await Promise.all(audioPromises);
          processedItem.audio_list = audioLists.filter(Boolean);
        }

        // Fetch other resources if needed
        if (item.document_folder && item.document_folder.length > 0) {
          const docPromises = item.document_folder.map(folderId => 
            fetchArticleDocument(store, folderId)
          );
          const docLists = await Promise.all(docPromises);
          processedItem.document_list = docLists.flat().filter(Boolean);
        }


        return processedItem;
      })
    );

    // Process topic_list - fetch article_list for each topic
    const processedTopicList = await Promise.all(
      (response.data.topic_list || []).map(async (topic) => {
        try {
          const topicArticlesResponse = await axios.get(
            store.api + GET_ARTICLE_LIST_BY_ID + topic.id + "/"
          );
          return {
            ...topic,
            topic_list: topicArticlesResponse.data.topic_list || []
          };
        } catch (error) {
          console.error(`Error fetching articles for topic ${topic.id}:`, error);
          return {
            ...topic,
            topic_list: []
          };
        }
      })
    );

    const topicList = {
      ...response.data,
      article_list: processedArticleList,
      topic_list: processedTopicList
    };

    return topicList;

  } catch (error) {
    console.error("Unexpected error fetching article info:", error);
    throw error; // Re-throw to allow caller to handle
  }
};

export const fetchArticleAudio = async (store, audioFolderId) => {
  try {
    const audioRes = await axios.get(
      store.api + GET_AUDIO_LIST_BY_ID + audioFolderId + "/"
    );
    return audioRes.data.audio_list[0]?.translations[store.lang]?.file || "";
  } catch (audioFetchError) {
    console.error("Error fetching audio file:", audioFetchError);
    return ""; // Return empty string on error
  }
};

export const fetchArticleDocument = async (store, documentFolderId) => {
  try {
    const documentRes = await axios.get(
      store.api + GET_DOCUMENT_LIST_BY_ID + documentFolderId + "/"
    );
    return documentRes.data.document_list || [];
  } catch (documentFetchError) {
    console.error("Error fetching document file:", documentFetchError);
    return []; // Return empty array on error
  }
};

export const fetchArticlePosition = async (store, positionFolderId) => {
  try {
    const positionRes = await axios.get(
      store.api + GET_POSITION_LIST_BY_ID + positionFolderId + "/"
    );
    return positionRes.data.position_list || [];
  } catch (positionFetchError) {
    console.error("Error fetching position file:", positionFetchError);
    return []; // Return empty array on error
  }
};

export const fetchArticleImageFolder = async (store, imageFolderId) => {
  try {
    const imageRes = await axios.get(
      store.api + GET_IMAGE_LIST_BY_ID + imageFolderId + "/"
    );
    return imageRes.data;
  } catch (imageFetchError) {
    console.error("Error fetching image file:", imageFetchError);
    return []; // Return empty array on error
  }
};

export const fetchArticleVideo = async (store, videoFolderId) => {
  try {
    const videoRes = await axios.get(
      store.api + GET_VIDEO_LIST_BY_ID + videoFolderId + "/"
    );
    return videoRes.data.video_list || [];
  } catch (videoFetchError) {
    console.error("Error fetching video file:", videoFetchError);
    return []; // Return empty array on error
  }
};

export const fetchArticleTour = async (store, tourFolderId) => {
  try {
    const tourRes = await axios.get(
      store.api + GET_TOUR_LIST_BY_ID + tourFolderId + "/"
    );
    return tourRes.data.tour_list || [];
  } catch (tourFetchError) {
    console.error("Error fetching tour file:", tourFetchError);
    return []; // Return empty array on error
  }
};

export const fetchArticleById = async (store, personId) => {
  try {
    const personInfo = await axios.get(
      store.api + GET_PERSON_BY_ID + personId + "/"
    );
    return personInfo.data || {};
  } catch (personFetchError) {
    console.error("Error fetching person detail:", personFetchError);
    return {}; // Return empty object on error
  }
};