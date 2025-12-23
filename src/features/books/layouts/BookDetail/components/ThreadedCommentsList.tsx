import { useState } from "react";
import { Avatar, Button, Space, Spin, Typography } from "antd";
import { Clock, MessageSquare, Trash2 } from "lucide-react";
import dayjs from "dayjs";
import type { BookComment } from "@/features/books/types";
import "./ThreadedCommentsList.scss";

const { Text } = Typography;

export interface ThreadedCommentsListProps {
  comments: BookComment[];
  loading?: boolean;
  onDeleteComment?: (commentId: string, userId: string) => void;
  deletingCommentId?: string;
}

interface CommentItemProps {
  comment: BookComment;
  level: number;
  onDeleteComment?: (commentId: string, userId: string) => void;
  deletingCommentId?: string;
}

function CommentItem({
  comment,
  level,
  onDeleteComment,
  deletingCommentId,
}: CommentItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const isReply = level > 0;
  const hasReplies = comment.replies && comment.replies.length > 0;
  const isDeleting = deletingCommentId === comment.id;

  const handleDelete = () => {
    if (onDeleteComment && !isDeleting) {
      onDeleteComment(comment.id, comment.user.id);
    }
  };

  return (
    <div className={`comment-item ${isReply ? "comment-item--reply" : ""}`}>
      <div className="comment-item__content">
        <div className="comment-item__header">
          <Space size={12}>
            <Avatar
              src={comment.user.avatar}
              size={isReply ? 32 : 40}
              className="comment-item__avatar"
            >
              {comment.user.username.charAt(0).toUpperCase()}
            </Avatar>
            <div className="comment-item__user-info">
              <Text strong className="comment-item__username">
                {comment.user.username}
              </Text>
              <Space size={4} className="comment-item__date">
                <Clock size={12} />
                <Text type="secondary" className="comment-item__date-text">
                  {dayjs(comment.createdAt).format("DD/MM/YYYY")}
                </Text>
              </Space>
            </div>
          </Space>

          {onDeleteComment && (
            <Button
              type="text"
              danger
              icon={<Trash2 size={16} />}
              onClick={handleDelete}
              loading={isDeleting}
              className="comment-item__delete-btn"
            />
          )}
        </div>

        <div className="comment-item__text">{comment.content}</div>

        {hasReplies && (
          <div
            className="comment-item__reply-toggle"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Space size={4}>
              <MessageSquare size={14} />
              <Text className="comment-item__reply-count">
                {comment.replies!.length} phản hồi
              </Text>
            </Space>
          </div>
        )}
      </div>

      {hasReplies && isExpanded && (
        <div className="comment-item__replies">
          {comment.replies!.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              level={level + 1}
              onDeleteComment={onDeleteComment}
              deletingCommentId={deletingCommentId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ThreadedCommentsList({
  comments,
  loading = false,
  onDeleteComment,
  deletingCommentId,
}: ThreadedCommentsListProps) {
  const topLevelComments = comments.filter(
    (comment) => !comment.parentId || comment.parentId === null
  );

  if (loading) {
    return (
      <div className="threaded-comments-list threaded-comments-list--loading">
        <Spin tip="Đang tải bình luận..." />
      </div>
    );
  }

  if (topLevelComments.length === 0) {
    return (
      <div className="threaded-comments-list threaded-comments-list--empty">
        <Text type="secondary">Chưa có bình luận nào</Text>
      </div>
    );
  }

  return (
    <div className="threaded-comments-list">
      {topLevelComments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          level={0}
          onDeleteComment={onDeleteComment}
          deletingCommentId={deletingCommentId}
        />
      ))}
    </div>
  );
}
