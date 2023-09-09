import { useState, useEffect, useRef } from 'react';
import { Pagination as AntPagination } from 'antd';
import styles from './Pagination.module.css';

interface PaginationProps {
  count: number | null;
  loading: boolean;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ count, loading, currentPage, onPageChange }: PaginationProps) => {
  const [total, setTotal] = useState(count || 0);
  const totalRef = useRef<number>();

  useEffect(() => {
    if (count !== null && count !== totalRef.current) {
      totalRef.current = count;
      setTotal(count);
    }
  }, [count]);

  return (
    <>
      <h3 className={styles.total}>Total {total} items</h3>
      <AntPagination
        total={total}
        current={currentPage}
        disabled={loading}
        pageSize={20}
        onChange={onPageChange}
        showSizeChanger={false}
        hideOnSinglePage
      />
    </>
  );
};

export { Pagination };
