import { useEffect, useState } from "react";
import { useAuthenticated } from "features/auth/hooks";
import { useMarkDocAsReadMutation } from "features/docs/hooks";

export default function useSelection(query) {
  const { data, isLoading } = query;
  const is_authenticated = useAuthenticated();
  const [markDocAsRead] = useMarkDocAsReadMutation();
  const [selected, setSelected] = useState(null);

  //marks clicked doc as selected
  //set as read if unread
  const handleOnListItemClick = (doc) => {
    if (selected === doc.pk) {
      setSelected(null);
    } else {
      setSelected(doc.pk);
      if (is_authenticated && !doc.is_read) {
        markDocAsRead({ pk: doc.pk, read: true });
      }
    }
  };

  //keyboard navigation
  // use Left and Right to select previous/next doc in list
  const handleKeyUp = (e) => {
    if (!isLoading) {
      const current_id = selected
        ? data?.results?.findIndex((d) => d.pk === selected)
        : 0;
      if (e.charCode === 37 || e.key === "ArrowLeft") {
        if (current_id > 0) {
          handleOnListItemClick(data?.results?.[current_id - 1]);
          e.preventDefault();
        }
      }
      if (e.charCode === 39 || e.key === "ArrowRight") {
        if (current_id < data?.results?.length - 1) {
          handleOnListItemClick(data?.results?.[current_id + 1]);
          e.preventDefault();
        }
      }
    }
  };

  useEffect(() => {
    //set first element as selected when loaded
    //only if nothing was selected before
    if (data?.results?.length > 0 && selected === null) {
      handleOnListItemClick(data?.results?.[0]);
    }
  }, [data]);

  return { selected, handleKeyUp, handleItemClick: handleOnListItemClick };
}
