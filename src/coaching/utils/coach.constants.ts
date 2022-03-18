/* eslint-disable prettier/prettier */
export const YOUTUBE_URL_REGEX =
  '^(https?://)?(www.)?(youtube.com|youtu.be)/.+$';

export const DEFAULT_COACHEE_IMAGE = {
  key: 'default-coachee.jpg',
  location: 'https://mindfit-core.s3.amazonaws.com/default.jpg',
  filename: 'default-coachee.jpg',
};
export const DEFAULT_COACH_IMAGE = {
  key: 'default-coach.jpg',
  location: 'https://mindfit-core.s3.amazonaws.com/default.jpg',
  filename: 'default-coach.jpg',
};
export const DEFAULT_ORGANIZATION_IMAGE = {
  key: 'default-organization.jpg',
  location: 'https://mindfit-core.s3.amazonaws.com/default.jpg',
  filename: 'default-organization.jpg',
};

export const DEFAULT_COACH_VIDEO = {
  key: 'default-coach-video.jpg',
  location: 'https://mindfit-core.s3.amazonaws.com/default.mp4',
  filename: 'default-coach-video.mp4',
};

export const DEFAULT_KEYS = [
  DEFAULT_COACHEE_IMAGE.key,
  DEFAULT_COACH_IMAGE.key,
  DEFAULT_ORGANIZATION_IMAGE.key,
  DEFAULT_COACH_VIDEO.key,
];
