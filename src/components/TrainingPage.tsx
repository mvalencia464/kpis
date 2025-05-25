import React, { useState } from 'react';
import { Play, Clock, Users, BookOpen, ExternalLink } from 'lucide-react';
import { Button } from './Button';

interface TrainingVideo {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  thumbnailUrl: string;
  videoId: string; // YouTube video ID placeholder
}

const featuredVideo: TrainingVideo = {
  id: 'featured',
  title: '"Measure What Matters" Dashboard Series',
  description: 'This comprehensive training series is based on John Doerr\'s "Measure What Matters" methodology, adapted specifically for construction businesses using JobTread. Each video includes a downloadable dashboard template that you can import directly into your JobTread account. Perfect for construction business owners, project managers, and team leaders.',
  duration: '45:00',
  difficulty: 'Beginner',
  category: 'Overview',
  thumbnailUrl: 'https://storage.googleapis.com/msgsndr/tV8qFLdWkBLBfjh64cFV/media/6832b9aee23506817f5bb7f1.webp',
  videoId: 'dQw4w9WgXcQ' // Placeholder YouTube ID
};

const trainingVideos: TrainingVideo[] = [
  {
    id: '1',
    title: '🚀 Project Mastery: OKRs for On-Time, On-Budget Construction (JobTread Dashboard Pt. 1)',
    description: 'Stop guessing, start knowing! Part 1 of our "Measure What Matters" series unveils the JobTread Project Delivery Excellence Dashboard. Learn how to set OKRs and track crucial KPIs like on-time completion, budget adherence, and milestone achievement to drive your construction projects to success. Import this dashboard directly into your JobTread account!',
    duration: '12:45',
    difficulty: 'Beginner',
    category: 'Project Management',
    thumbnailUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=225&fit=crop&crop=center',
    videoId: 'dQw4w9WgXcQ' // Placeholder YouTube ID
  },
  {
    id: '2',
    title: '💰 Boost Your Bottom Line: Construction Financial KPIs & OKRs (JobTread Dashboard Pt. 2)',
    description: 'Is your construction business truly profitable? In Part 2, we dive into the Financial Health & Profitability Dashboard for JobTread. Discover how to use OKRs based on "Measure What Matters" to track gross/net profit margins, cash flow, and AR days. Gain financial clarity and drive healthy growth. Template available for your JobTread account!',
    duration: '15:30',
    difficulty: 'Intermediate',
    category: 'Financial Management',
    thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=225&fit=crop&crop=center',
    videoId: 'dQw4w9WgXcQ'
  },
  {
    id: '3',
    title: '📈 Win More Bids & Grow! Client Success OKRs for Builders (JobTread Dashboard Pt. 3)',
    description: 'Happy clients = more business! Part 3 focuses on the JobTread Client Relationship & Growth Dashboard. We apply "Measure What Matters" principles to help you track client satisfaction, bid win rates, and lead conversion. Build stronger relationships and fuel sustainable growth. Get the JobTread dashboard template now!',
    duration: '11:20',
    difficulty: 'Beginner',
    category: 'Client Management',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=225&fit=crop&crop=center',
    videoId: 'dQw4w9WgXcQ'
  },
  {
    id: '4',
    title: '✅ Zero Harm, Max Quality: Safety & Compliance OKRs in Construction (JobTread Dashboard Pt. 4)',
    description: 'Build it right, build it safe! This episode (Part 4) introduces the Safety, Quality & Compliance Dashboard for JobTread. Learn to set impactful OKRs for safety records (LTIFR), quality audit pass rates, and compliance, inspired by "Measure What Matters." Elevate your standards and protect your reputation. Import into JobTread today!',
    duration: '13:15',
    difficulty: 'Intermediate',
    category: 'Safety & Quality',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=225&fit=crop&crop=center',
    videoId: 'dQw4w9WgXcQ'
  },
  {
    id: '5',
    title: '⚙️ Peak Performance: OKRs for Construction Team & Ops Efficiency (JobTread Dashboard Pt. 5)',
    description: 'Unlock your team\'s potential and streamline operations! In our final part (Pt. 5), explore the JobTread Team & Operational Efficiency Dashboard. We\'ll show you how to use "Measure What Matters" OKRs to track billable ratios, equipment utilization, and subcontractor performance. Drive productivity and build a high-performing team. JobTread template inside!',
    duration: '14:45',
    difficulty: 'Advanced',
    category: 'Operations',
    thumbnailUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=225&fit=crop&crop=center',
    videoId: 'dQw4w9WgXcQ'
  },
  {
    id: '6',
    title: '🌍 Build from Anywhere: OKRs for the Remote Construction CEO (JobTread Dashboard Pt. 6)',
    description: 'Leading a construction company remotely? This video (Part 6) unpacks how CEOs can leverage the "Measure What Matters" OKR philosophy with a specialized JobTread Dashboard. Discover Key Results for ensuring stellar communication, remote team engagement, project visibility, and process adoption. Learn to scale your construction business effectively, no matter your location. Import the dashboard template and command your business from anywhere!',
    duration: '16:30',
    difficulty: 'Advanced',
    category: 'Leadership',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=225&fit=crop&crop=center',
    videoId: 'dQw4w9WgXcQ'
  }
];

export const TrainingPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedVideo, setSelectedVideo] = useState<TrainingVideo | null>(null);

  const categories = ['all', ...Array.from(new Set(trainingVideos.map(v => v.category)))];

  const filteredVideos = selectedCategory === 'all'
    ? trainingVideos
    : trainingVideos.filter(video => video.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-900/30 text-green-300 border border-green-600';
      case 'Intermediate': return 'bg-yellow-900/30 text-yellow-300 border border-yellow-600';
      case 'Advanced': return 'bg-red-900/30 text-red-300 border border-red-600';
      default: return 'bg-gray-700 text-gray-300 border border-gray-600';
    }
  };

  const openVideo = (video: TrainingVideo) => {
    // In a real implementation, this would open a video player modal
    // For now, we'll just set the selected video
    setSelectedVideo(video);
    // Placeholder: Open YouTube video in new tab
    window.open(`https://www.youtube.com/watch?v=${video.videoId}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Training Center</h1>
          <p className="text-gray-300 mt-1">
            Master JobTread dashboards with our comprehensive video training series
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-gray-300" />
          <span className="text-sm text-gray-300">{trainingVideos.length} videos available</span>
        </div>
      </div>

      {/* Featured Video */}
      <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
        <div className="md:flex">
          {/* Video Thumbnail */}
          <div className="md:w-1/2 relative aspect-video bg-gray-700">
            <img
              src={featuredVideo.thumbnailUrl}
              alt={featuredVideo.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Button
                onClick={() => openVideo(featuredVideo)}
                variant="primary"
                icon={<Play className="h-6 w-6" />}
                size="lg"
              >
                Watch Series Overview
              </Button>
            </div>
            <div className="absolute bottom-3 right-3 bg-black bg-opacity-75 text-white text-sm px-3 py-1 rounded">
              {featuredVideo.duration}
            </div>
            <div className="absolute top-3 left-3 bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-medium">
              FEATURED
            </div>
          </div>

          {/* Video Info */}
          <div className="md:w-1/2 p-6">
            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-block px-3 py-1 text-sm font-medium rounded ${getDifficultyColor(featuredVideo.difficulty)}`}>
                {featuredVideo.difficulty}
              </span>
              <span className="text-sm text-gray-400">{featuredVideo.category}</span>
            </div>

            <h2 className="text-2xl font-bold text-white mb-3">
              {featuredVideo.title}
            </h2>

            <p className="text-gray-300 mb-6 leading-relaxed">
              {featuredVideo.description}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-400">
                <Clock className="h-4 w-4 mr-2" />
                {featuredVideo.duration} total runtime
              </div>
              <Button
                onClick={() => openVideo(featuredVideo)}
                variant="primary"
                icon={<Play className="h-4 w-4" />}
              >
                Start Watching
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
            }`}
          >
            {category === 'all' ? 'All Categories' : category}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video) => (
          <div key={video.id} className="bg-gray-800 border border-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg hover:border-gray-600 transition-all">
            {/* Video Thumbnail */}
            <div className="relative aspect-video bg-gray-700">
              <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Button
                  onClick={() => openVideo(video)}
                  variant="primary"
                  icon={<Play className="h-5 w-5" />}
                >
                  Watch Now
                </Button>
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                {video.duration}
              </div>
            </div>

            {/* Video Info */}
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(video.difficulty)}`}>
                  {video.difficulty}
                </span>
                <span className="text-xs text-gray-400">{video.category}</span>
              </div>

              <h3 className="font-semibold text-white mb-2 line-clamp-2">
                {video.title}
              </h3>

              <p className="text-sm text-gray-300 mb-4 line-clamp-3">
                {video.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-400">
                  <Clock className="h-3 w-3 mr-1" />
                  {video.duration}
                </div>
                <Button
                  onClick={() => openVideo(video)}
                  variant="outline"
                  size="sm"
                  icon={<ExternalLink className="h-3 w-3" />}
                >
                  Watch
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <Play className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">No videos found</h3>
          <p className="text-gray-400">Try selecting a different category</p>
        </div>
      )}


    </div>
  );
};
